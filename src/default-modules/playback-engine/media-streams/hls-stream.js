import HlsJs from 'hls.js';

import { ERRORS, MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE, VIDEO_EVENTS } from '../../../constants/index';
import { geOverallBufferLength, getNearestBufferSegmentInfo } from '../../../utils/video-data';


export default class HlsStream {
  static isSupported(env) {
    return env.MSE && HlsJs.isSupported();
  }

  static canPlay(mediaType) {
    return mediaType === MEDIA_STREAM_TYPES.HLS;
  }

  constructor(mediaStreams, eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.hls = null;
    this.videoElement = null;
    this.mediaStream = null;
    this.attachOnPlay = () => {
      if (!this.videoElement) {
        return;
      }
      this.hls.startLoad();
      this.videoElement.removeEventListener('play', this.attachOnPlay);
    };

    this.onError = (type, errorEvent) => {
      if (errorEvent && (errorEvent.details === 'manifestParsingError' || errorEvent.details === 'manifestLoadError')) {
        this.eventEmitter.emit(
          VIDEO_EVENTS.ERROR,
          ERRORS.SRC_LOAD_ERROR,
          this.mediaStream && this.mediaStream.url,
          errorEvent
        );
      }
    };
    if (mediaStreams.length === 1) {
      this.mediaStream = mediaStreams[0];
    } else {
      throw new Error(`Can only handle a single HLS stream. Received ${mediaStreams.length} streams.`);
    }
  }

  attach(videoElement, initialBitrate) {
    if (!this.mediaStream) {
      return;
    }
    this.videoElement = videoElement;
    const config = { abrEwmaDefaultEstimate: initialBitrate * 1000 };
    if (videoElement.preload === 'none') {
      config.autoStartLoad = false;
      videoElement.addEventListener('play', this.attachOnPlay);
    }
    this.hls = new HlsJs(config);
    this.hls.on(HlsJs.Events.ERROR, this.onError);
    this.hls.loadSource(this.mediaStream.url);
    this.hls.attachMedia(videoElement);
  }

  detach(videoElement) {
    if (!this.mediaStream) {
      return;
    }
    this.hls.off(HlsJs.Events.ERROR, this.onError);
    this.hls.destroy();
    this.hls = null;
    videoElement.removeEventListener('play', this.attachOnPlay);
    this.videoElement = null;
  }

  getMediaStreamDeliveryType() {
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
      deliveryType: this.getMediaStreamDeliveryType(),
      bitrates,
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo
    };
  }
}
