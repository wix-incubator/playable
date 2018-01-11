import * as HlsJs from 'hls.js/dist/hls.light';

import {
  ERRORS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
  VIDEO_EVENTS,
} from '../../../constants/index';
import {
  geOverallBufferLength,
  getNearestBufferSegmentInfo,
} from '../../../utils/video-data';
import { NativeEnvironmentSupport } from '../../../utils/environment-detection';
import { IPlaybackAdapter } from './types';

const LIVE_SYNC_DURATION = 4;
const LIVE_SYNC_DURATION_DELTA = 5;
const DEFAULT_HLS_CONFIG = {
  abrEwmaDefaultEstimate: 5000 * 1000,
  liveSyncDuration: LIVE_SYNC_DURATION,
};

export default class HlsAdapter implements IPlaybackAdapter {
  static isSupported() {
    return NativeEnvironmentSupport.MSE && HlsJs.isSupported();
  }

  private eventEmitter;
  private hls;
  private videoElement: HTMLVideoElement;
  private mediaStream;

  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.hls = null;
    this.videoElement = null;
    this.mediaStream = null;

    this._bindCallbacks();
  }

  _bindCallbacks() {
    this.attachOnPlay = this.attachOnPlay.bind(this);
    this.broadcastError = this.broadcastError.bind(this);
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
    if (!this.hls) {
      return false;
    }
    const { details } = this.hls.levels[this.hls.firstLevel];

    return details.live;
  }

  get isSyncWithLive(): boolean {
    if (!this.isDynamicContent) {
      return false;
    }

    return (
      this.videoElement.currentTime >
      this.syncWithLiveTime - LIVE_SYNC_DURATION_DELTA
    );
  }

  get isSeekAvailable(): boolean {
    if (this.isDynamicContent) {
      const { details } = this.hls.levels[this.hls.firstLevel];
      const type = details.type.trim();
      return type === 'EVENT';
    }

    return true;
  }

  get mediaStreamDeliveryType() {
    return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
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
      deliveryType: this.mediaStreamDeliveryType,
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
        `Can only handle a single DASH stream. Received ${
          mediaStreams.length
        } streams.`,
      );
    }
  }

  logError(error, errorEvent) {
    this.eventEmitter.emit(VIDEO_EVENTS.ERROR, {
      errorType: error,
      streamType: MEDIA_STREAM_TYPES.HLS,
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

      this.hls.startLoad();
    } else if (data.type === ErrorTypes.MEDIA_ERROR) {
      switch (data.details) {
        case ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
          this.logError(ERRORS.MANIFEST_INCOMPATIBLE, data);
          break;
        default:
          this.logError(ERRORS.MEDIA, data);
      }

      this.hls.recoverMediaError();
    } else {
      this.logError(ERRORS.UNKNOWN, data);
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
    this.hls.loadSource(this.mediaStream.url);
    this.hls.attachMedia(this.videoElement);
  }

  detach() {
    if (!this.mediaStream) {
      return;
    }
    this.hls.off(HlsJs.Events.ERROR, this.broadcastError);
    this.hls.destroy();
    this.hls = null;

    this.videoElement.removeEventListener('play', this.attachOnPlay);
    this.videoElement = null;
  }
}
