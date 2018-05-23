import { VIDEO_EVENTS, ERRORS } from '../../../constants';

import {
  geOverallBufferLength,
  getNearestBufferSegmentInfo,
} from '../../../utils/video-data';
import { NativeEnvironmentSupport } from '../../../utils/environment-detection';
import { IPlaybackAdapter } from './types';

const NATIVE_ERROR_CODES = {
  ABORTED: 1,
  NETWORK: 2,
  DECODE: 3,
  SRC_NOT_SUPPORTED: 4,
};

export default function getNativeAdapterCreator(streamType, deliveryPriority) {
  class NativeAdapter implements IPlaybackAdapter {
    static isSupported() {
      return NativeEnvironmentSupport[streamType];
    }

    private mediaStreams;
    private eventEmitter;
    private currentLevel;
    private videoElement;

    constructor(eventEmitter) {
      this.mediaStreams = null;
      this.eventEmitter = eventEmitter;
      this.currentLevel = 0;

      this._bindCallbacks();
    }

    get currentUrl() {
      return this.mediaStreams[this.currentLevel].url;
    }

    get syncWithLiveTime() {
      // TODO: implement syncWithLiveTime for `native`
      return undefined;
    }

    get isDynamicContent() {
      return !isFinite(this.videoElement.duration);
    }

    get isDynamicContentEnded() {
      // TODO: implement isDynamicContentEnded
      return false;
    }

    get isSyncWithLive() {
      // TODO: implement isSyncWithLive for `native`
      return false;
    }

    get isSeekAvailable() {
      return true;
      //Need to find better solution
      /*
      if (this.isDynamicContent) {
        return false;
      }

      return Boolean(this.videoElement.seekable.length);
      */
    }

    get mediaStreamDeliveryPriority() {
      return deliveryPriority;
    }

    get mediaStreamType() {
      return streamType;
    }

    get debugInfo() {
      if (this.videoElement) {
        const { buffered, currentTime } = this.videoElement;

        const overallBufferLength = geOverallBufferLength(buffered);
        const nearestBufferSegInfo = getNearestBufferSegmentInfo(
          buffered,
          currentTime,
        );

        return {
          ...this.mediaStreams[0],
          deliveryPriority: this.mediaStreamDeliveryPriority,
          overallBufferLength,
          nearestBufferSegInfo,
        };
      }

      return {};
    }

    private _bindCallbacks() {
      this._broadcastError = this._broadcastError.bind(this);
    }

    canPlay(mediaType) {
      return mediaType === streamType;
    }

    setMediaStreams(mediaStreams) {
      this.mediaStreams = mediaStreams;
    }

    private _logError(error, errorEvent) {
      this.eventEmitter.emit(VIDEO_EVENTS.ERROR, {
        errorType: error,
        streamType,
        streamProvider: 'native',
        errorInstance: errorEvent,
      });
    }

    private _broadcastError() {
      const error = this.videoElement.error;
      if (!error) {
        this._logError(ERRORS.UNKNOWN, null);
        return;
      }

      switch (error.code) {
        case NATIVE_ERROR_CODES.ABORTED:
          //No need for broadcasting

          break;
        case NATIVE_ERROR_CODES.NETWORK:
          this._logError(ERRORS.CONTENT_LOAD, error);
          break;
        case NATIVE_ERROR_CODES.DECODE:
          this._logError(ERRORS.MEDIA, error);
          break;
        case NATIVE_ERROR_CODES.SRC_NOT_SUPPORTED:
          /*
            Our url checks would not allow not supported formats, so only case would be
             when video tag couldn't retriev any info from endpoit
          */

          this._logError(ERRORS.CONTENT_LOAD, error);

          break;
        default:
          this._logError(ERRORS.UNKNOWN, error);
          break;
      }
    }

    attach(videoElement) {
      this.videoElement = videoElement;
      this.videoElement.addEventListener('error', this._broadcastError);
      this.videoElement.src = this.mediaStreams[this.currentLevel].url;
    }

    detach() {
      this.videoElement.removeEventListener('error', this._broadcastError);
      this.videoElement.removeAttribute('src');
      this.videoElement = null;
    }
  }

  return NativeAdapter;
}
