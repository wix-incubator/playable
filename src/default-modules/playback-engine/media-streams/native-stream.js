import { VIDEO_EVENTS, ERRORS } from '../../../constants';

import { geOverallBufferLength, getNearestBufferSegmentInfo } from '../../../utils/video-data';


const NATIVE_ERROR_CODES = {
  ABORTED: 1,
  NETWORK: 2,
  DECODE: 3,
  SRC_NOT_SUPPORTED: 4
};

export default function getNativeStreamCreator(streamType, deliveryType) {
  class NativeStream {
    static isSupported(env) {
      return env[streamType];
    }

    static canPlay(mediaType) {
      return mediaType === streamType;
    }

    constructor(mediaStreams, eventEmitter) {
      this.mediaStreams = mediaStreams;
      this.eventEmitter = eventEmitter;
      this.currentLevel = 0;

      this.onError = error => {
        switch (error.code) {
          case NATIVE_ERROR_CODES.ABORTED:
            //No need for broadcasting

            break;
          case NATIVE_ERROR_CODES.NETWORK:
            this.logError(ERRORS.CONTENT_LOAD, error);
            break;
          case NATIVE_ERROR_CODES.DECODE:
            this.logError(ERRORS.MEDIA, error);
            break;
          case NATIVE_ERROR_CODES.SRC_NOT_SUPPORTED:
            //No need for broadcasting

            break;
          default:
            this.logError(ERRORS.UNKNOWN, error);
            break;
        }
      };
    }

    logError(error, errorEvent) {
      this.eventEmitter.emit(
        VIDEO_EVENTS.ERROR,
        {
          errorType: error,
          streamType,
          streamProvider: 'native',
          errorInstance: errorEvent
        }
      );
    }

    attach(videoElement) {
      this.videoElement = videoElement;
      this.videoElement.addEventListener('error', this.onError);
      videoElement.src = this.mediaStreams[this.currentLevel].url;
    }

    detach(videoElement) {
      this.videoElement.removeEventListener('error', this.onError);
      this.videoElement = null;
      videoElement.src = '';
    }

    getMediaStreamDeliveryType() {
      return deliveryType;
    }

    getMediaStreamType() {
      return streamType;
    }

    getDebugInfo() {
      if (this.videoElement) {
        const { buffered, currentTime } = this.videoElement;

        const overallBufferLength = geOverallBufferLength(buffered);
        const nearestBufferSegInfo = getNearestBufferSegmentInfo(buffered, currentTime);

        return {
          ...this.mediaStreams[0],
          deliveryType: this.getMediaStreamDeliveryType(),
          overallBufferLength,
          nearestBufferSegInfo
        };
      }

      return {};
    }
  }

  return NativeStream;
}
