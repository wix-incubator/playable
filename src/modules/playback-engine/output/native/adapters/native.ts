import { VideoEvent, Error } from '../../../../../constants';

import {
  geOverallBufferLength,
  getNearestBufferSegmentInfo,
} from '../../../../../utils/video-data';
import { NativeEnvironmentSupport } from '../../../../../utils/environment-detection';
import { IPlaybackAdapterClass, IPlaybackAdapter } from './types';
import { IEventEmitter } from '../../../../event-emitter/types';

const NATIVE_ERROR_CODES = {
  ABORTED: 1,
  NETWORK: 2,
  DECODE: 3,
  SRC_NOT_SUPPORTED: 4,
};

import {
  MediaStreamType,
  MediaStreamDeliveryPriority,
} from '../../../../../constants';

export default function getNativeAdapterCreator(
  streamType: MediaStreamType,
  deliveryPriority: MediaStreamDeliveryPriority,
): IPlaybackAdapterClass {
  class NativeAdapter implements IPlaybackAdapter {
    static isSupported(): boolean {
      return NativeEnvironmentSupport[streamType];
    }

    private mediaStreams: any;
    private eventEmitter: IEventEmitter;
    private currentLevel: number;
    private video: HTMLVideoElement;

    constructor(eventEmitter: IEventEmitter) {
      this.mediaStreams = null;
      this.eventEmitter = eventEmitter;
      this.currentLevel = 0;

      this._bindCallbacks();
    }

    get currentUrl() {
      return this.mediaStreams[this.currentLevel].url;
    }

    get syncWithLiveTime(): any {
      // TODO: implement syncWithLiveTime for `native`
      return undefined;
    }

    get isDynamicContent() {
      return !isFinite(this.video.duration);
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

      return Boolean(this.output.seekable.length);
      */
    }

    get mediaStreamDeliveryPriority() {
      return deliveryPriority;
    }

    get mediaStreamType() {
      return streamType;
    }

    get debugInfo() {
      if (this.video) {
        const { buffered, currentTime } = this.video;

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

    canPlay(mediaType: MediaStreamType) {
      return mediaType === streamType;
    }

    setMediaStreams(mediaStreams: any) {
      this.mediaStreams = mediaStreams;
    }

    private _logError(error: string, errorEvent: MediaError) {
      this.eventEmitter.emitAsync(VideoEvent.ERROR, {
        errorType: error,
        streamType,
        streamProvider: 'native',
        errorInstance: errorEvent,
      });
    }

    private _broadcastError() {
      const error = this.video.error; // take error from event?
      if (!error) {
        this._logError(Error.UNKNOWN, null);
        return;
      }

      switch (error.code) {
        case NATIVE_ERROR_CODES.ABORTED:
          //No need for broadcasting

          break;
        case NATIVE_ERROR_CODES.NETWORK:
          this._logError(Error.CONTENT_LOAD, error);
          break;
        case NATIVE_ERROR_CODES.DECODE:
          this._logError(Error.MEDIA, error);
          break;
        case NATIVE_ERROR_CODES.SRC_NOT_SUPPORTED:
          /*
            Our url checks would not allow not supported formats, so only case would be
             when video tag couldn't retriev any info from endpoit
          */

          this._logError(Error.CONTENT_LOAD, error);

          break;
        default:
          this._logError(Error.UNKNOWN, error);
          break;
      }
    }

    attach(videoElement: HTMLVideoElement) {
      this.video = videoElement;

      this.video.addEventListener('error', this._broadcastError);
      this.video.src = this.mediaStreams[this.currentLevel].url;
    }

    detach() {
      this.video.removeEventListener('error', this._broadcastError);
      this.video.removeAttribute('src');
      this.video = null;
    }
  }

  return NativeAdapter;
}
