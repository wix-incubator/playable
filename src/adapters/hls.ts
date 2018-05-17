import HlsJs from 'hls.js/dist/hls.light';

import {
  geOverallBufferLength,
  getNearestBufferSegmentInfo,
} from '../utils/video-data';
import { NativeEnvironmentSupport } from '../utils/environment-detection';
import { isDesktopSafari } from '../utils/device-detection';
import {
  ERRORS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_PRIORITY,
  VIDEO_EVENTS,
  IPlaybackAdapter,
} from '../index';

const LIVE_SYNC_DURATION = 4;
const LIVE_SYNC_DURATION_DELTA = 5;
const DEFAULT_HLS_CONFIG: any = {
  abrEwmaDefaultEstimate: 5000 * 1000,
  liveSyncDuration: LIVE_SYNC_DURATION,
};
const NETWORK_ERROR_RECOVER_TIMEOUT = 1000;
const MEDIA_ERROR_RECOVER_TIMEOUT = 1000;

export default class HlsAdapter implements IPlaybackAdapter {
  static DEFAULT_HLS_CONFIG = DEFAULT_HLS_CONFIG;
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
  private _isAttached: boolean;
  private _times: any;

  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.hls = null;
    this.videoElement = null;
    this.mediaStream = null;

    this._isDynamicContent = false;
    this._isDynamicContentEnded = null;

    this._bindCallbacks();
    this._resetTimes();
  }

  private _bindCallbacks() {
    this._attachOnPlay = this._attachOnPlay.bind(this);
    this._broadcastError = this._broadcastError.bind(this);
    this._onEndOfStream = this._onEndOfStream.bind(this);
    this._onLevelUpdated = this._onLevelUpdated.bind(this);
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
      ? MEDIA_STREAM_DELIVERY_PRIORITY.FORCED
      : MEDIA_STREAM_DELIVERY_PRIORITY.ADAPTIVE_VIA_MSE;
  }

  get debugInfo() {
    let bitrates;
    let currentTime = 0;
    let currentBitrate = null;
    let nearestBufferSegInfo = null;
    let overallBufferLength = null;
    let bwEstimate = 0;

    if (this.hls.levelController) {
      bitrates = this.hls.levelController.levels.map(level => level.bitrate);
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
      if (this.hls.streamController.stats) {
        bwEstimate = this.hls.streamController.stats.bwEstimate;
      }
    }

    return {
      ...this.mediaStream,
      bwEstimate,
      deliveryPriority: this.mediaStreamDeliveryPriority,
      bitrates,
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo,
    };
  }

  canPlay(mediaType) {
    return mediaType === MEDIA_STREAM_TYPES.HLS;
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

  private _logError(error, errorEvent) {
    this.eventEmitter.emit(VIDEO_EVENTS.ERROR, {
      errorType: error,
      streamType: MEDIA_STREAM_TYPES.HLS,
      streamProvider: 'hls.js',
      errorInstance: errorEvent,
    });
  }

  private _broadcastError(_error, data) {
    // TODO: `_error` argument is unused
    if (!data.fatal) {
      return;
    }

    const { ErrorTypes, ErrorDetails } = HlsJs;

    if (data.type === ErrorTypes.NETWORK_ERROR) {
      switch (data.details) {
        case ErrorDetails.MANIFEST_LOAD_ERROR:
          this._logError(ERRORS.MANIFEST_LOAD, data);
          break;
        case ErrorDetails.MANIFEST_LOAD_TIMEOUT:
          this._logError(ERRORS.MANIFEST_LOAD, data);
          break;
        case ErrorDetails.MANIFEST_PARSING_ERROR:
          this._logError(ERRORS.MANIFEST_PARSE, data);
          break;
        case ErrorDetails.LEVEL_LOAD_ERROR:
          this._logError(ERRORS.LEVEL_LOAD, data);
          break;
        case ErrorDetails.LEVEL_LOAD_TIMEOUT:
          this._logError(ERRORS.LEVEL_LOAD, data);
          break;
        case ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
          this._logError(ERRORS.CONTENT_LOAD, data);
          break;
        case ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT:
          this._logError(ERRORS.CONTENT_LOAD, data);
          break;
        case ErrorDetails.FRAG_LOAD_ERROR:
          this._logError(ERRORS.CONTENT_LOAD, data);
          break;
        case ErrorDetails.FRAG_LOAD_TIMEOUT:
          this._logError(ERRORS.CONTENT_LOAD, data);
          break;
        default:
          this._logError(ERRORS.UNKNOWN, data);
          break;
      }

      this._tryRecoverNetworkError();
    } else if (data.type === ErrorTypes.MEDIA_ERROR) {
      switch (data.details) {
        case ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
          this._logError(ERRORS.MANIFEST_INCOMPATIBLE, data);
          break;
        case ErrorDetails.FRAG_PARSING_ERROR:
          this._logError(ERRORS.CONTENT_PARSE, data);
          break;
        default:
          this._logError(ERRORS.MEDIA, data);
          break;
      }

      this._tryRecoverMediaError();
    } else {
      this._logError(ERRORS.UNKNOWN, data);
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

  private _attachOnPlay() {
    if (!this.videoElement) {
      return;
    }
    this.hls.startLoad();
    this.videoElement.removeEventListener('play', this._attachOnPlay);
  }

  attach(videoElement) {
    if (!this.mediaStream) {
      return;
    }

    this._resetTimes();

    const config: any = {
      ...HlsAdapter.DEFAULT_HLS_CONFIG,
    };

    this.videoElement = videoElement;

    if (this.videoElement.preload === 'none') {
      config.autoStartLoad = false;
      this.videoElement.addEventListener('play', this._attachOnPlay);
    }

    this.hls = new HlsJs(config);

    this.hls.on(HlsJs.Events.ERROR, this._broadcastError);
    this.hls.on(HlsJs.Events.LEVEL_UPDATED, this._onLevelUpdated);
    this.hls.on(HlsJs.Events.BUFFER_EOS, this._onEndOfStream);

    this.hls.loadSource(this.mediaStream.url);
    this.hls.attachMedia(this.videoElement);
    this._startStoringTime();
    this._isAttached = true;
  }

  private _onLevelUpdated(_eventName, { details }) {
    this._isDynamicContent = details.live;
    this._isDynamicContentEnded = details.live ? false : null;

    this.hls.off(HlsJs.Events.LEVEL_UPDATED, this._onLevelUpdated);
  }

  private _onEndOfStream() {
    if (this._isDynamicContent) {
      this._isDynamicContentEnded = true;

      this.eventEmitter.emit(VIDEO_EVENTS.DYNAMIC_CONTENT_ENDED);
    }
  }

  private _startStoringTime() {
    this.hls.on(HlsJs.Events.FRAG_LOADED, (_, { frag, stats }) => {
      this._times.loading.push({
        size: stats.loaded,
        url: frag.relurl,
        bitrate: this.hls.levels[frag.level].bitrate,
        time: stats.tload - stats.trequest,
      });
    });
    this.hls.on(HlsJs.Events.FRAG_BUFFERED, (_, { frag, stats }) => {
      this._times.buffering.push({
        size: stats.loaded,
        url: frag.relurl,
        bitrate: this.hls.levels[frag.level].bitrate,
        time: stats.tbuffered - stats.tload,
      });
    });
  }

  private _resetTimes() {
    this._times = {
      loading: [],
      buffering: [],
    };
  }

  detach() {
    if (!this._isAttached) {
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

    this.hls.off(HlsJs.Events.ERROR, this._broadcastError);
    this.hls.off(HlsJs.Events.BUFFER_EOS, this._onEndOfStream);
    this.hls.off(HlsJs.Events.LEVEL_UPDATED, this._onLevelUpdated);

    this.hls.destroy();
    this.hls = null;

    this.videoElement.removeEventListener('play', this._attachOnPlay);
    this.videoElement.removeAttribute('src');
    this.videoElement = null;
  }
}
