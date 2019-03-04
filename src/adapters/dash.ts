import { MediaPlayer } from 'dashjs/build/es5/index_mediaplayerOnly';

import { getNearestBufferSegmentInfo } from '../utils/video-data';
import { NativeEnvironmentSupport } from '../utils/environment-detection';

import {
  Error as PlayableError,
  MediaStreamType,
  MediaStreamDeliveryPriority,
  VideoEvent,
} from '../constants';

import { IPlaybackAdapter } from '../modules/playback-engine/output/native/adapters/types';
import { IEventEmitter } from '../modules/event-emitter/types';
import { IParsedPlayableSource } from '../modules/playback-engine/types';

const INITIAL_BITRATE = 5000;

const DashEvents = MediaPlayer.events;

export default class DashAdapter implements IPlaybackAdapter {
  static isSupported() {
    return NativeEnvironmentSupport.MSE;
  }

  private eventEmitter: any;
  private dashPlayer: any;
  private mediaStream: IParsedPlayableSource;
  private videoElement: HTMLVideoElement;

  constructor(eventEmitter: IEventEmitter) {
    this.eventEmitter = eventEmitter;

    this.dashPlayer = null;
    this.mediaStream = null;
    this.videoElement = null;

    this._bindCallbacks();
  }

  canPlay(mediaType: MediaStreamType) {
    return mediaType === MediaStreamType.DASH;
  }

  get mediaStreamDeliveryPriority() {
    return MediaStreamDeliveryPriority.ADAPTIVE_VIA_MSE;
  }

  get currentUrl() {
    return this.mediaStream.url;
  }

  get syncWithLiveTime(): any {
    // TODO: implement syncWithLiveTime for `dash`
    return undefined;
  }

  get isDynamicContent() {
    return false;
  }

  get isDynamicContentEnded() {
    // TODO: implement isDynamicContentEnded
    return false;
  }

  get isSyncWithLive() {
    return false;
  }

  get isSeekAvailable() {
    return true;
  }

  get debugInfo() {
    const currentStream = this.dashPlayer.getActiveStream();
    let currentTime = 0;
    if (currentStream) {
      currentTime = this.dashPlayer.time(currentStream.getId());
    }

    const bitrates = this.dashPlayer
      .getBitrateInfoListFor('video')
      .map((bitrateInfo: any) => bitrateInfo.bitrate);
    let currentBitrate = null;
    if (this.dashPlayer.getQualityFor('video') && bitrates) {
      currentBitrate = bitrates[this.dashPlayer.getQualityFor('video')];
    }

    const overallBufferLength = this.dashPlayer.getBufferLength('video');
    const currentTrack = this.dashPlayer.getCurrentTrackFor('video');
    const nearestBufferSegInfo = getNearestBufferSegmentInfo(
      this.dashPlayer.getVideoElement().buffered,
      currentTime,
    );
    const bwEstimate = this.dashPlayer.getAverageThroughput('video');

    return {
      ...this.mediaStream,
      bwEstimate,
      deliveryPriority: this.mediaStreamDeliveryPriority,
      bitrates,
      currentBitrate,
      overallBufferLength,
      currentTrack,
      nearestBufferSegInfo,
    };
  }

  private _bindCallbacks() {
    this._broadcastError = this._broadcastError.bind(this);
  }

  setMediaStreams(mediaStreams: IParsedPlayableSource[]) {
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

  private _logError(error: string, errorEvent: any) {
    this.eventEmitter.emitAsync(VideoEvent.ERROR, {
      errorType: error,
      streamType: MediaStreamType.DASH,
      streamProvider: 'dash.js',
      errorInstance: errorEvent,
    });
  }

  private _broadcastError(errorEvent: any) {
    if (!errorEvent) {
      return;
    }

    if (errorEvent.error === 'download') {
      switch (errorEvent.event.id) {
        case 'manifest':
          this._logError(PlayableError.MANIFEST_LOAD, errorEvent);
          break;
        case 'content':
          this._logError(PlayableError.CONTENT_LOAD, errorEvent);
          break;
        case 'initialization':
          this._logError(PlayableError.LEVEL_LOAD, errorEvent);
          break;
        default:
          this._logError(PlayableError.UNKNOWN, errorEvent);
      }
    } else if (errorEvent.error === 'manifestError') {
      switch (errorEvent.event.id) {
        case 'codec':
          this._logError(PlayableError.MANIFEST_INCOMPATIBLE, errorEvent);
          break;
        case 'parse':
          this._logError(PlayableError.MANIFEST_PARSE, errorEvent);
          break;
        default:
          this._logError(PlayableError.UNKNOWN, errorEvent);
      }
    } else if (errorEvent.error === 'mediasource') {
      this._logError(PlayableError.MEDIA, errorEvent);
    } else {
      this._logError(PlayableError.UNKNOWN, errorEvent);
    }
  }

  attach(videoOutput: HTMLVideoElement) {
    if (!this.mediaStream) {
      return;
    }
    this.videoElement = videoOutput;
    this.dashPlayer = MediaPlayer().create();
    this.dashPlayer.getDebug().setLogToBrowserConsole(false);
    this.dashPlayer.on(DashEvents.ERROR, this._broadcastError);

    if (videoOutput.preload === 'none') {
      this._startDelayedInitPlayer();
    } else {
      this._initPlayer();
    }
  }

  private _delayedInitPlayer() {
    this._stopDelayedInitPlayer();
    this._initPlayer(true);
  }

  private _startDelayedInitPlayer() {
    this.eventEmitter.on(
      VideoEvent.PLAY_REQUEST,
      this._delayedInitPlayer,
      this,
    );
  }

  private _stopDelayedInitPlayer() {
    this.eventEmitter.off(
      VideoEvent.PLAY_REQUEST,
      this._delayedInitPlayer,
      this,
    );
  }

  private _initPlayer(forceAutoplay?: boolean) {
    this.dashPlayer.initialize(
      this.videoElement,
      this.mediaStream.url,
      forceAutoplay || this.videoElement.autoplay,
    );
    this.dashPlayer.setInitialBitrateFor('video', INITIAL_BITRATE);
  }

  detach() {
    this._stopDelayedInitPlayer();
    if (!this.mediaStream) {
      return;
    }
    this.dashPlayer.reset();
    this.dashPlayer.off(DashEvents.ERROR, this._broadcastError);
    this.dashPlayer = null;
    this.videoElement.removeAttribute('src');
    this.videoElement = null;
  }
}
