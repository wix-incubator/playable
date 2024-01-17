import HlsJs from 'hls.js/dist/hls.light.js';
import {
  geOverallBufferLength,
  getNearestBufferSegmentInfo,
} from '../utils/video-data';
import { NativeEnvironmentSupport } from '../utils/environment-detection';
import { isDesktopSafari, isAndroid } from '../utils/device-detection';
import {
  Error as PlayableError,
  MediaStreamType,
  MediaStreamDeliveryPriority,
  VideoEvent,
} from '../constants';
import { IPlaybackAdapter } from '../modules/playback-engine/output/native/adapters/types';
import { IEventEmitter } from '../modules/event-emitter/types';
import { IParsedPlayableSource } from '../modules/playback-engine/types';

const LIVE_SYNC_DURATION = 4;
const LIVE_SYNC_DURATION_DELTA = 5;
const DEFAULT_HLS_CONFIG: any = {
  abrEwmaDefaultEstimate: 5000 * 1000,
  liveSyncDuration: LIVE_SYNC_DURATION,
  nudgeMaxRetry: 40, // can be removed with hls v1.5.0 https://github.com/video-dev/hls.js/issues/5904#issuecomment-1762365377
};
const NETWORK_ERROR_RECOVER_TIMEOUT = 1000;
const MEDIA_ERROR_RECOVER_TIMEOUT = 1000;

export default class HlsAdapter implements IPlaybackAdapter {
  static DEFAULT_HLS_CONFIG = DEFAULT_HLS_CONFIG;
  static isSupported() {
    return NativeEnvironmentSupport.MSE && HlsJs.isSupported();
  }

  private eventEmitter: IEventEmitter;
  private hls: HlsJs;
  private videoElement: HTMLVideoElement;
  private mediaStream: IParsedPlayableSource;

  private _mediaRecoverTimeout: number;
  private _networkRecoverTimeout: number;
  private _isDynamicContent: boolean;
  private _isDynamicContentEnded: boolean;
  private _isAttached: boolean;

  constructor(eventEmitter: IEventEmitter) {
    this.eventEmitter = eventEmitter;
    this.hls = null;
    this.videoElement = null;
    this.mediaStream = null;

    this._isDynamicContent = false;
    this._isDynamicContentEnded = null;

    this._bindCallbacks();
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
    return isDesktopSafari() || isAndroid()
      ? MediaStreamDeliveryPriority.FORCED
      : MediaStreamDeliveryPriority.ADAPTIVE_VIA_MSE;
  }

  get debugInfo() {
    let bitrates;
    let currentTime = 0;
    let currentBitrate = null;
    let nearestBufferSegInfo = null;
    let overallBufferLength = null;
    let bwEstimate = 0;

    const { streamController, levelController } = this.hls as any;

    if (levelController) {
      bitrates = levelController.levels.map((level: any) => level.bitrate);
      if (bitrates) {
        currentBitrate = bitrates[levelController.level];
      }
    }
    if (streamController) {
      currentTime = streamController.lastCurrentTime;
      if (streamController.mediaBuffer) {
        overallBufferLength = geOverallBufferLength(
          streamController.mediaBuffer.buffered,
        );
        nearestBufferSegInfo = getNearestBufferSegmentInfo(
          streamController.mediaBuffer.buffered,
          currentTime,
        );
      }
      if (streamController.stats) {
        bwEstimate = streamController.stats.bwEstimate;
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

  canPlay(mediaType: MediaStreamType) {
    return mediaType === MediaStreamType.HLS;
  }

  setMediaStreams(mediaStreams: IParsedPlayableSource[]) {
    if (mediaStreams.length === 1) {
      this.mediaStream = mediaStreams[0];
    } else {
      throw new Error(
        `Can only handle a single HLS stream. Received ${mediaStreams.length} streams.`,
      );
    }
  }

  private _logError(error: string, errorEvent: any) {
    this.eventEmitter.emitAsync(VideoEvent.ERROR, {
      errorType: error,
      streamType: MediaStreamType.HLS,
      streamProvider: 'hls.js',
      errorInstance: errorEvent,
    });
  }

  private _broadcastError(_error: any, data: any) {
    // TODO: Investigate why this callback is called after hls is destroyed
    if (!this.hls) {
      return;
    }

    const { ErrorTypes, ErrorDetails } = HlsJs;

    if (data.type === ErrorTypes.NETWORK_ERROR) {
      switch (data.details) {
        case ErrorDetails.MANIFEST_LOAD_ERROR:
          this._logError(PlayableError.MANIFEST_LOAD, data);
          break;
        case ErrorDetails.MANIFEST_LOAD_TIMEOUT:
          this._logError(PlayableError.MANIFEST_LOAD, data);
          break;
        case ErrorDetails.MANIFEST_PARSING_ERROR:
          this._logError(PlayableError.MANIFEST_PARSE, data);
          break;
        case ErrorDetails.LEVEL_LOAD_ERROR:
          this._logError(PlayableError.LEVEL_LOAD, data);
          break;
        case ErrorDetails.LEVEL_LOAD_TIMEOUT:
          this._logError(PlayableError.LEVEL_LOAD, data);
          break;
        case ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
          this._logError(PlayableError.CONTENT_LOAD, data);
          break;
        case ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT:
          this._logError(PlayableError.CONTENT_LOAD, data);
          break;
        case ErrorDetails.FRAG_LOAD_ERROR:
          this._logError(PlayableError.CONTENT_LOAD, data);
          break;
        case ErrorDetails.FRAG_LOAD_TIMEOUT:
          this._logError(PlayableError.CONTENT_LOAD, data);
          break;
        default:
          this._logError(PlayableError.UNKNOWN, data);
          break;
      }
      if (data.fatal) {
        this._tryRecoverNetworkError();
      }
    } else if (data.type === ErrorTypes.MEDIA_ERROR) {
      // NOTE: when error is BUFFER_STALLED_ERROR or BUFFER_FULL_ERROR
      // video play successfully without recovering
      // while recover breaks video playback
      if (
        data.fatal &&
        data.details !== ErrorDetails.BUFFER_STALLED_ERROR &&
        data.details !== ErrorDetails.BUFFER_FULL_ERROR
      ) {
        this._tryRecoverMediaError();
      }

      switch (data.details) {
        case ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
          this._logError(PlayableError.MANIFEST_INCOMPATIBLE, data);
          break;
        case ErrorDetails.FRAG_PARSING_ERROR:
          this._logError(PlayableError.CONTENT_PARSE, data);
          break;
        default:
          this._logError(PlayableError.MEDIA, data);
          break;
      }
    } else {
      this._logError(PlayableError.UNKNOWN, data);
    }
  }

  private _tryRecoverMediaError() {
    if (!this._mediaRecoverTimeout) {
      this.hls.recoverMediaError();
      this._mediaRecoverTimeout = window.setTimeout(() => {
        this._mediaRecoverTimeout = null;
      }, MEDIA_ERROR_RECOVER_TIMEOUT);
    }
  }

  private _tryRecoverNetworkError() {
    if (!this._networkRecoverTimeout) {
      this.hls.startLoad();
      this._networkRecoverTimeout = window.setTimeout(() => {
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

  private _onLevelUpdated(_eventName: string, { details }: any) {
    this._isDynamicContent = details.live;
    this._isDynamicContentEnded = details.live ? false : null;

    this.hls.off(HlsJs.Events.LEVEL_UPDATED, this._onLevelUpdated);
  }

  private _onEndOfStream() {
    if (this._isDynamicContent) {
      this._isDynamicContentEnded = true;

      this.eventEmitter.emitAsync(VideoEvent.DYNAMIC_CONTENT_ENDED);
    }
  }

  attach(videoElement: HTMLVideoElement) {
    if (!this.mediaStream) {
      return;
    }

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
    this._isAttached = true;
  }

  detach() {
    if (!this._isAttached) {
      return;
    }

    if (this._networkRecoverTimeout) {
      window.clearTimeout(this._networkRecoverTimeout);
      this._networkRecoverTimeout = null;
    }

    if (this._mediaRecoverTimeout) {
      window.clearTimeout(this._mediaRecoverTimeout);
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
