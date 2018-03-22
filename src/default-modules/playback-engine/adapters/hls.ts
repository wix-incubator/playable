import HlsJs from 'hls.js/dist/hls.light';

import {
  ERRORS,
  MediaStreamTypes,
  MediaStreamDeliveryPriority,
  VIDEO_EVENTS,
} from '../../../constants';
import {
  geOverallBufferLength,
  getNearestBufferSegmentInfo,
} from '../../../utils/video-data';
import { NativeEnvironmentSupport } from '../../../utils/environment-detection';
import { isDesktopSafari } from '../../../utils/device-detection';
import { IPlaybackAdapter } from './types';

const LIVE_SYNC_DURATION = 4;
const LIVE_SYNC_DURATION_DELTA = 5;
const DEFAULT_HLS_CONFIG = {
  abrEwmaDefaultEstimate: 5000 * 1000,
  liveSyncDuration: LIVE_SYNC_DURATION,
};
const NETWORK_ERROR_RECOVER_TIMEOUT = 1000;
const MEDIA_ERROR_RECOVER_TIMEOUT = 1000;

export default class HlsAdapter implements IPlaybackAdapter {
  static isSupported() {
    return NativeEnvironmentSupport.MSE && HlsJs.isSupported();
  }

  private eventEmitter;
  private hls;
  private videoElement: HTMLVideoElement;
  private mediaStream;

  private _mediaRecoverTimeout: any;
  private _networkRecoverTimeout: any;
  private _isDynamicContent: boolean;
  private _isDynamicContentEnded: boolean;

  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.hls = null;
    this.videoElement = null;
    this.mediaStream = null;

    this._isDynamicContent = false;
    this._isDynamicContentEnded = null;

    this._bindCallbacks();
  }

  _bindCallbacks() {
    this.attachOnPlay = this.attachOnPlay.bind(this);
    this.broadcastError = this.broadcastError.bind(this);
    this._onManifestParsed = this._onManifestParsed.bind(this);
    this._onEndOfStream = this._onEndOfStream.bind(this);
  }

  get currentUrl() {
    return this.mediaStream.url;
  }

  get syncWithLiveTime(): number {
    if (!this.isDynamicContent) {
      return;
    }

    return (
      this.hls.liveSyncPosition ||
      this.videoElement.duration - LIVE_SYNC_DURATION
    );
  }

  get isDynamicContent(): boolean {
    return this._isDynamicContent;
  }

  get isDynamicContentEnded(): boolean {
    return this._isDynamicContentEnded;
  }

  get isSyncWithLive(): boolean {
    if (!this.isDynamicContent || this.isDynamicContentEnded) {
      return false;
    }

    return (
      this.videoElement.currentTime >
      this.syncWithLiveTime - LIVE_SYNC_DURATION_DELTA
    );
  }

  get isSeekAvailable(): boolean {
    if (this.isDynamicContent && this.hls.levels) {
      const level = this.hls.levels[this.hls.firstLevel];
      if (!level.details) {
        return false;
      }
      const type = level.details.type || '';
      return type.trim() === 'EVENT';
    }

    return true;
  }

  get mediaStreamDeliveryPriority() {
    return isDesktopSafari()
      ? MediaStreamDeliveryPriority.FORCED
      : MediaStreamDeliveryPriority.ADAPTIVE_VIA_MSE;
  }

  get debugInfo() {
    let bitrates;
    let currentTime = 0;
    let currentBitrate = null;
    let nearestBufferSegInfo = null;
    let overallBufferLength = null;

    if (this.hls.levelController) {
      bitrates = this.hls.levelController.levels;
      if (bitrates) {
        currentBitrate = bitrates[this.hls.levelController.level];
      }
    }
    if (this.hls.streamController) {
      currentTime = this.hls.streamController.lastCurrentTime;
      if (this.hls.streamController.mediaBuffer) {
        overallBufferLength = geOverallBufferLength(
          this.hls.streamController.mediaBuffer.buffered,
        );
        nearestBufferSegInfo = getNearestBufferSegmentInfo(
          this.hls.streamController.mediaBuffer.buffered,
          currentTime,
        );
      }
    }

    return {
      ...this.mediaStream,
      deliveryPriority: this.mediaStreamDeliveryPriority,
      bitrates,
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo,
    };
  }

  canPlay(mediaType) {
    return mediaType === MediaStreamTypes.HLS;
  }

  setMediaStreams(mediaStreams) {
    if (mediaStreams.length === 1) {
      this.mediaStream = mediaStreams[0];
    } else {
      throw new Error(
        `Can only handle a single HLS stream. Received ${
          mediaStreams.length
        } streams.`,
      );
    }
  }

  logError(error, errorEvent) {
    this.eventEmitter.emit(VIDEO_EVENTS.ERROR, {
      errorType: error,
      streamType: MediaStreamTypes.HLS,
      streamProvider: 'hls.js',
      errorInstance: errorEvent,
    });
  }

  broadcastError(_error, data) {
    // TODO: `_error` argument is unused
    if (!data.fatal) {
      return;
    }

    const { ErrorTypes, ErrorDetails } = HlsJs;

    if (data.type === ErrorTypes.NETWORK_ERROR) {
      switch (data.details) {
        case ErrorDetails.MANIFEST_LOAD_ERROR:
          this.logError(ERRORS.MANIFEST_LOAD, data);
          break;
        case ErrorDetails.MANIFEST_LOAD_TIMEOUT:
          this.logError(ERRORS.MANIFEST_LOAD, data);
          break;
        case ErrorDetails.MANIFEST_PARSING_ERROR:
          this.logError(ERRORS.MANIFEST_PARSE, data);
          break;
        case ErrorDetails.LEVEL_LOAD_ERROR:
          this.logError(ERRORS.LEVEL_LOAD, data);
          break;
        case ErrorDetails.LEVEL_LOAD_TIMEOUT:
          this.logError(ERRORS.LEVEL_LOAD, data);
          break;
        case ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
          this.logError(ERRORS.CONTENT_LOAD, data);
          break;
        case ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT:
          this.logError(ERRORS.CONTENT_LOAD, data);
          break;
        case ErrorDetails.FRAG_LOAD_ERROR:
          this.logError(ERRORS.CONTENT_LOAD, data);
          break;
        case ErrorDetails.FRAG_LOAD_TIMEOUT:
          this.logError(ERRORS.CONTENT_LOAD, data);
          break;
        default:
          this.logError(ERRORS.UNKNOWN, data);
      }

      this._tryRecoverNetworkError();
    } else if (data.type === ErrorTypes.MEDIA_ERROR) {
      switch (data.details) {
        case ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
          this.logError(ERRORS.MANIFEST_INCOMPATIBLE, data);
          break;
        case ErrorDetails.FRAG_PARSING_ERROR:
          this.logError(ERRORS.CONTENT_PARSE, data);
          break;
        default:
          this.logError(ERRORS.MEDIA, data);
          break;
      }

      this._tryRecoverMediaError();
    } else {
      this.logError(ERRORS.UNKNOWN, data);
    }
  }

  private _tryRecoverMediaError() {
    if (!this._mediaRecoverTimeout) {
      this.hls.recoverMediaError();
      this._mediaRecoverTimeout = setTimeout(() => {
        this._mediaRecoverTimeout = null;
      }, MEDIA_ERROR_RECOVER_TIMEOUT);
    }
  }

  private _tryRecoverNetworkError() {
    if (!this._networkRecoverTimeout) {
      this.hls.startLoad();
      this._networkRecoverTimeout = setTimeout(() => {
        this._networkRecoverTimeout = null;
      }, NETWORK_ERROR_RECOVER_TIMEOUT);
    }
  }

  attachOnPlay() {
    if (!this.videoElement) {
      return;
    }
    this.hls.startLoad();
    this.videoElement.removeEventListener('play', this.attachOnPlay);
  }

  attach(videoElement) {
    if (!this.mediaStream) {
      return;
    }

    const config: any = { ...DEFAULT_HLS_CONFIG };

    this.videoElement = videoElement;

    if (this.videoElement.preload === 'none') {
      config.autoStartLoad = false;
      this.videoElement.addEventListener('play', this.attachOnPlay);
    }

    this.hls = new HlsJs(config);
    this.hls.on(HlsJs.Events.ERROR, this.broadcastError);
    this.hls.on(HlsJs.Events.MANIFEST_PARSED, this._onManifestParsed);
    this.hls.on(HlsJs.Events.BUFFER_EOS, this._onEndOfStream);
    this.hls.loadSource(this.mediaStream.url);
    this.hls.attachMedia(this.videoElement);
  }

  private _onManifestParsed() {
    // NOTE: first  level details is not ready on MANIFEST_PARSED. Wait until first LEVEL_UPDATED
    const onLevelUpdated = (_eventName, { details }) => {
      this._isDynamicContent = details.live;
      this._isDynamicContentEnded = details.live ? false : null;

      this.hls.off(HlsJs.Events.LEVEL_UPDATED, onLevelUpdated);
    };

    this.hls.on(HlsJs.Events.LEVEL_UPDATED, onLevelUpdated);
  }

  private _onEndOfStream() {
    if (this._isDynamicContent) {
      this._isDynamicContentEnded = true;

      this.eventEmitter.emit(VIDEO_EVENTS.DYNAMIC_CONTENT_ENDED);
    }
  }

  detach() {
    if (!this.mediaStream) {
      return;
    }

    if (this._networkRecoverTimeout) {
      clearTimeout(this._networkRecoverTimeout);
      this._networkRecoverTimeout = null;
    }

    if (this._mediaRecoverTimeout) {
      clearTimeout(this._mediaRecoverTimeout);
      this._mediaRecoverTimeout = null;
    }

    this.hls.off(HlsJs.Events.ERROR, this.broadcastError);
    this.hls.off(HlsJs.Events.MANIFEST_PARSED, this._onManifestParsed);
    this.hls.off(HlsJs.Events.BUFFER_EOS, this._onEndOfStream);
    this.hls.destroy();
    this.hls = null;

    this.videoElement.removeEventListener('play', this.attachOnPlay);
    this.videoElement.removeAttribute('src');
    this.videoElement = null;
  }
}
