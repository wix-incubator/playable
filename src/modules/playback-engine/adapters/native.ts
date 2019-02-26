import { VIDEO_EVENTS, ERRORS } from '../../../constants';

import {
  geOverallBufferLength,
  getNearestBufferSegmentInfo,
} from '../../../utils/video-data';
import { NativeEnvironmentSupport } from '../../../utils/environment-detection';
import { IPlaybackAdapterClass, IPlaybackAdapter } from './types';
import { IEventEmitter } from '../../event-emitter/types';

const NATIVE_ERROR_CODES = {
  ABORTED: 1,
  NETWORK: 2,
  DECODE: 3,
  SRC_NOT_SUPPORTED: 4,
};

import {
  MediaStreamTypes,
  MediaStreamDeliveryPriority,
} from '../../../constants';
import { IVideoOutput } from '../types';

export default function getNativeAdapterCreator(
  streamType: MediaStreamTypes,
  deliveryPriority: MediaStreamDeliveryPriority,
): IPlaybackAdapterClass {
  class NativeAdapter implements IPlaybackAdapter {
    static isSupported(): boolean {
      return NativeEnvironmentSupport[streamType];
    }

    private mediaStreams: any;
    private eventEmitter: IEventEmitter;
    private currentLevel: number;
    private output: IVideoOutput;

    constructor(eventEmitter: IEventEmitter) {
      this.mediaStreams = null;
      this.eventEmitter = eventEmitter;
      this.currentLevel = 0;

      this._bindCallbacks();
    }

    get currentUrl() {
      return this.mediaStreams[this.currentLevel].url;
    }
    //@ts-ignore
    get syncWithLiveTime() {
      // TODO: implement syncWithLiveTime for `native`
      return undefined;
    }

    get isDynamicContent() {
      return !isFinite(this.output.duration);
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
      if (this.output) {
        const { buffered, currentTime } = this.output;

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

    canPlay(mediaType: MediaStreamTypes) {
      return mediaType === streamType;
    }

    setMediaStreams(mediaStreams: any) {
      this.mediaStreams = mediaStreams;
    }

    private _logError(error: string, errorEvent: MediaError) {
      this.eventEmitter.emit(VIDEO_EVENTS.ERROR, {
        errorType: error,
        streamType,
        streamProvider: 'native',
        errorInstance: errorEvent,
      });
    }

    private _broadcastError() {
      const error = this.output.error; // take error from event?
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

    attach(videoElement: IVideoOutput) {
      this.output = videoElement;
      this.output.on('error', this._broadcastError);
      this.output.setSrc(this.mediaStreams[this.currentLevel].url);
    }

    detach() {
      this.output.off('error', this._broadcastError);
      this.output.setSrc(null);
      this.output = null;
    }
  }

  return NativeAdapter;
}
