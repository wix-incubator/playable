import { MediaPlayer } from 'dashjs';

import { ERRORS, MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE, VIDEO_EVENTS } from '../../../constants/index';
import { getNearestBufferSegmentInfo } from '../../../utils/video-data';


const DashEvents = MediaPlayer.events;

export default class DashStream {
  static isSupported(env) {
    return env.MSE;
  }

  static canPlay(mediaType) {
    return mediaType === MEDIA_STREAM_TYPES.DASH;
  }

  logError(error, errorEvent) {
    this.eventEmitter.emit(
      VIDEO_EVENTS.ERROR,
      {
        errorType: error,
        streamType: MEDIA_STREAM_TYPES.DASH,
        streamProvider: 'dash.js',
        errorInstance: errorEvent
      }
    );
  }

  constructor(mediaStreams, eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.dashPlayer = null;
    this.mediaStream = null;
    this.videoElement = null;

    this.attachOnPlay = () => {
      if (!this.videoElement) {
        return;
      }
      this.dashPlayer.initialize(this.videoElement, this.mediaStream.url, true);

      if (this._initialBitrate) {
        this.dashPlayer.setInitialBitrateFor('video', this._initialBitrate);
      }
      this.videoElement.removeEventListener('play', this.attachOnPlay);
    };

    this.onError = errorEvent => {
      if (!errorEvent) {
        return;
      }

      if (errorEvent.error === 'download') {
        switch (errorEvent.event.id) {
          case 'manifest':
            this.logError(ERRORS.MANIFEST_LOAD, errorEvent);
            break;
          case 'content':
            this.logError(ERRORS.CONTENT_LOAD, errorEvent);
            break;
          case 'initialization':
            this.logError(ERRORS.LEVEL_LOAD, errorEvent);
            break;
          default:
            this.logError(ERRORS.UNKNOWN, errorEvent);
        }
      } else if (errorEvent.error === 'manifestError') {
        switch (errorEvent.event.id) {
          case 'codec':
            this.logError(ERRORS.MANIFEST_INCOMPATIBLE, errorEvent);
            break;
          case 'parse':
            this.logError(ERRORS.MANIFEST_PARSE, errorEvent);
            break;
          default:
            this.logError(ERRORS.UNKNOWN, errorEvent);
        }
      } else if (errorEvent.error === 'mediasource') {
        this.logError(ERRORS.MEDIA, errorEvent);
      } else {
        this.logError(ERRORS.UNKNOWN, errorEvent);
      }
    };

    if (mediaStreams.length === 1) {
      this.mediaStream = mediaStreams[0];
    } else {
      throw new Error(`Can only handle a single DASH stream. Received ${mediaStreams.length} streams.`);
    }
  }

  attach(videoElement, initialBitrate) {
    if (!this.mediaStream) {
      return;
    }
    this._initialBitrate = initialBitrate;
    this.videoElement = videoElement;
    this.dashPlayer = MediaPlayer().create();
    this.dashPlayer.getDebug().setLogToBrowserConsole(false);
    this.dashPlayer.on(DashEvents.ERROR, this.onError);

    if (videoElement.preload === 'none') {
      this.startDelayedInitPlayer();
    } else {
      this.initPlayer();
    }
  }

  delayedInitPlayer() {
    this.stopDelayedInitPlayer();
    this.initPlayer(true);
  }

  startDelayedInitPlayer() {
    this.eventEmitter.on(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED, this.delayedInitPlayer, this);
  }

  stopDelayedInitPlayer() {
    this.eventEmitter.off(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED, this.delayedInitPlayer, this);
  }

  initPlayer(forceAutoplay) {
    this.dashPlayer.initialize(this.videoElement, this.mediaStream.url, forceAutoplay || this.videoElement.autoplay);
    if (this._initialBitrate) {
      this.dashPlayer.setInitialBitrateFor('video', this._initialBitrate);
    }
  }

  detach() {
    this.stopDelayedInitPlayer();
    if (!this.mediaStream) {
      return;
    }
    this.dashPlayer.reset();
    this.dashPlayer.off(DashEvents.ERROR, this.onError);
    this.dashPlayer = null;
    this.videoElement = null;
  }

  getMediaStreamDeliveryType() {
    return MEDIA_STREAM_DELIVERY_TYPE.ADAPTIVE_VIA_MSE;
  }

  getDebugInfo() {
    const currentStream = this.dashPlayer.getActiveStream();
    let currentTime = 0;
    if (currentStream) {
      currentTime = this.dashPlayer.time(currentStream.getId());
    }

    const bitrates = this.dashPlayer.getBitrateInfoListFor('video');
    let currentBitrate = null;
    if (this.dashPlayer.getQualityFor('video') && bitrates) {
      currentBitrate = bitrates[this.dashPlayer.getQualityFor('video')];
    }

    const overallBufferLength = this.dashPlayer.getBufferLength('video');
    const currentTrack = this.dashPlayer.getCurrentTrackFor('video');
    const nearestBufferSegInfo = getNearestBufferSegmentInfo(this.dashPlayer.getVideoElement().buffered, currentTime);

    return {
      ...this.mediaStream,
      deliveryType: this.getMediaStreamDeliveryType(),
      bitrates,
      currentBitrate,
      overallBufferLength,
      currentTrack,
      nearestBufferSegInfo
    };
  }
}
