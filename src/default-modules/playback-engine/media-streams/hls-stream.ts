import * as HlsJs from 'hls.js/dist/hls.light';

import { ERRORS, MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE, VIDEO_EVENTS } from '../../../constants/index';
import { geOverallBufferLength, getNearestBufferSegmentInfo } from '../../../utils/video-data';


const DEFAULT_HLS_CONFIG = {
  abrEwmaDefaultEstimate: 5000 * 1000,
  liveSyncDuration: 4
};

export default class HlsStream {
  static isSupported(env) {
    return env.MSE && HlsJs.isSupported();
  }

  static canPlay(mediaType) {
    return mediaType === MEDIA_STREAM_TYPES.HLS;
  }

  // TODO: check if props should be `private`
  private eventEmitter;
  private hls;
  private videoElement;
  private mediaStream;

  constructor(mediaStreams, eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.hls = null;
    this.videoElement = null;
    this.mediaStream = null;

    if (mediaStreams.length === 1) {
      this.mediaStream = mediaStreams[0];
    } else {
      throw new Error(`Can only handle a single HLS stream. Received ${mediaStreams.length} streams.`);
    }

    this._bindCallbacks();
  }

  _bindCallbacks() {
    this.attachOnPlay = this.attachOnPlay.bind(this);
    this.broadcastError = this.broadcastError.bind(this);
  }

  logError(error, errorEvent) {
    this.eventEmitter.emit(
      VIDEO_EVENTS.ERROR,
      {
        errorType: error,
        streamType: MEDIA_STREAM_TYPES.HLS,
        streamProvider: 'hls.js',
        errorInstance: errorEvent
      }
    );
  }

  broadcastError(error, data) {
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
      this.logError(VIDEO_EVENTS.UNKNOWN, data);
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

  get currentUrl() {
    return this.mediaStream.url;
  }

  get livePosition() {
    return this.hls.liveSyncPosition;
  }

  get isDynamicContent() {
    if (!this.hls) {
      return false;
    }
    const { details } = this.hls.levels[this.hls.firstLevel];

    return details.live;
  }

  get isSeekAvailable() {
    if (this.isDynamicContent) {
      const { details } = this.hls.levels[this.hls.firstLevel];

      return details.type === 'EVENT';
    }

    return true;
  }

  get mediaStreamDeliveryType() {
    return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
  }

  getDebugInfo() {
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
        overallBufferLength = geOverallBufferLength(this.hls.streamController.mediaBuffer.buffered);
        nearestBufferSegInfo = getNearestBufferSegmentInfo(this.hls.streamController.mediaBuffer.buffered, currentTime);
      }
    }

    return {
      ...this.mediaStream,
      deliveryType: this.mediaStreamDeliveryType,
      bitrates,
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo
    };
  }
}
