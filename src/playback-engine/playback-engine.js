import Vidi from 'vidi';
import { iPhone, iPod, Android, iPad } from '../utils/device-detection';

import { geOverallBufferLength, getNearestBufferSegmentInfo } from '../utils/video-data';

import VIDEO_EVENTS from '../constants/events/video';


//TODO: Find source of problem with native HLS on Safari, when playing state triggered but actual playing is delayed

export const STATES = {
  SRC_SET: 'src-set',
  LOAD_STARTED: 'load-started',
  METADATA_LOADED: 'metadata-loaded',
  READY_TO_PLAY: 'ready-to-play',
  SEEK_IN_PROGRESS: 'seek-in-progress',
  PLAY_REQUESTED: 'play-requested',
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended'
};

const NATIVE_VIDEO_EVENTS = [
  'loadstart', 'loadedmetadata', 'canplay', 'progress', 'play', 'playing', 'pause', 'ended',
  'stalled', 'suspend', 'waiting', 'durationchange', 'timeupdate', 'seeking', 'seeked', 'volumechange'
];

export default class Engine {
  static dependencies = ['eventEmitter', 'config'];

  constructor({ eventEmitter, config }) {
    this._eventEmitter = eventEmitter;
    this._video = document.createElement('video');
    this._vidi = new Vidi(this._video);
    this._currentState = null;

    this._isMetadataLoaded = false;
    this._statesTimestamps = {};

    this._bindCallbacks();
    this._bindEvents();

    this.STATES = STATES;
    this._applyConfig(config.engine);
  }

  _clearTimestamps() {
    this._statesTimestamps = {};
  }

  _setInitialTimeStamp() {
    this._initialTimeStamp = Date.now();
  }

  _setStateTimestamp(state) {
    if (!this._statesTimestamps[state]) {
      this._statesTimestamps[state] = Date.now() - this._initialTimeStamp;
      this._setInitialTimeStamp();
    }
  }

  _getStateTimestamps() {
    return this._statesTimestamps;
  }

  _applyConfig(config = {}) {
    const { preload, autoPlay, loop, muted, volume, playInline, src } = config;
    this.setPreload(preload);

    if (autoPlay) {
      this.setAutoPlay(true);
    }

    if (loop) {
      this.setLoop(true);
    }

    if (muted) {
      this.setMute(true);
    }

    if (volume) {
      this.setVolume(volume);
    }

    if (playInline) {
      this.setPlayInline(playInline);
    }

    if (src) {
      this.setSrc(src);
    }
  }

  getNode() {
    return this._video;
  }

  _sendError(error) {
    this._eventEmitter.emit(VIDEO_EVENTS.ERROR, error);
  }

  _bindCallbacks() {
    this._processEventFromVideo = this._processEventFromVideo.bind(this);
    this._sendError = this._sendError.bind(this);
  }

  _bindEvents() {
    this._vidi.on('error', this._sendError);

    NATIVE_VIDEO_EVENTS.forEach(event => this._video.addEventListener(event, this._processEventFromVideo));
  }

  _unbindEvents() {
    this._vidi.off('error', this._sendError);
    NATIVE_VIDEO_EVENTS.forEach(event => this._video.removeEventListener(event, this._processEventFromVideo));
  }

  _processEventFromVideo(event) {
    const videoEl = this._video;

    switch (event.type) {
      case 'loadstart': {
        this._setInitialTimeStamp();
        this._setState(STATES.LOAD_STARTED);
        break;
      }
      case 'loadedmetadata': {
        this._setStateTimestamp(STATES.METADATA_LOADED);
        this._setState(STATES.METADATA_LOADED);
        this._isMetadataLoaded = true;
        break;
      }
      case 'canplay': {
        this._setStateTimestamp(STATES.READY_TO_PLAY);
        this._setState(STATES.READY_TO_PLAY);
        break;
      }
      case 'play': {
        this._setState(STATES.PLAY_REQUESTED);
        break;
      }
      case 'playing': {
        this._setState(STATES.PLAYING);
        break;
      }
      case 'waiting': {
        this._setState(STATES.WAITING);
        break;
      }
      case 'pause': {
        this._setState(STATES.PAUSED);
        break;
      }
      case 'ended': {
        this._setState(STATES.ENDED);
        break;
      }
      case 'progress': {
        this._eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
        break;
      }
      case 'stalled': {
        this._eventEmitter.emit(VIDEO_EVENTS.UPLOAD_STALLED);
        break;
      }
      case 'suspend': {
        this._eventEmitter.emit(VIDEO_EVENTS.UPLOAD_SUSPEND);
        break;
      }
      case 'durationchange': {
        this._eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED, videoEl.duration);
        break;
      }
      case 'timeupdate': {
        this._eventEmitter.emit(VIDEO_EVENTS.CURRENT_TIME_UPDATED, videoEl.currentTime);
        break;
      }
      case 'seeking': {
        this._setState(STATES.SEEK_IN_PROGRESS);
        break;
      }
      case 'seeked': {
        this._setState(videoEl.paused ? STATES.PAUSED : STATES.PLAYING);
        break;
      }
      case 'volumechange': {
        this._eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, {
          volume: videoEl.volume,
          muted: videoEl.muted
        });
        break;
      }
      default: break;
    }
  }

  _setState(state) {
    //This case is happens only with dash.js sometimes when manifest got some problems
    if (this._currentState === STATES.METADATA_LOADED) {
      if (state === STATES.SEEK_IN_PROGRESS || state === STATES.PAUSED) {
        return;
      }
    }

    this._eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, { prevState: this._currentState, nextState: state });
    this._currentState = state;
  }

  getDebugInfo() {
    const { attachedStream } = this._vidi;
    const { duration, currentTime } = this._video;
    let data;

    if (attachedStream) {
      if (attachedStream.hls) {
        data = this._getHLSInfo(attachedStream.hls);
      } else if (attachedStream.dashPlayer) {
        data = this._getDashInfo(attachedStream.dashPlayer);
      } else {
        data = this._getNativeInfo(this._vidi);
      }
    } else {
      data = this._getNativeInfo(this._vidi);
    }

    return {
      ...data,
      viewDimensions: this._getViewDimensions(),
      currentTime,
      duration,
      loadingStateTimestamps: this._getStateTimestamps()
    };
  }

  _getDashInfo(dashPlayer) {
    const currentStream = dashPlayer.getActiveStream();
    let currentTime = 0;
    if (currentStream) {
      currentTime = dashPlayer.time(currentStream.getId());
    }
    const bitrates = dashPlayer.getBitrateInfoListFor('video');
    let currentBitrate = null;
    if (dashPlayer.getQualityFor('video') && bitrates) {
      currentBitrate = bitrates[dashPlayer.getQualityFor('video')];
    }
    const overallBufferLength = dashPlayer.getBufferLength('video');
    const currentTrack = dashPlayer.getCurrentTrackFor('video');
    const nearestBufferSegInfo = getNearestBufferSegmentInfo(dashPlayer.getVideoElement().buffered, currentTime);

    return {
      ...this._vidi.attachedStream.mediaStream,
      bitrates,
      currentBitrate,
      overallBufferLength,
      currentTrack,
      nearestBufferSegInfo
    };
  }

  _getHLSInfo(hls) {
    const overallBufferLength = geOverallBufferLength(hls.streamController.mediaBuffer.buffered);
    let bitrates;
    let currentTime = 0;
    let currentBitrate = null;
    let nearestBufferSegInfo = null;

    if (hls.levelController) {
      bitrates = hls.levelController.levels;
      if (bitrates) {
        currentBitrate = bitrates[hls.levelController.level];
      }
    }
    if (hls.streamController) {
      currentTime = hls.streamController.lastCurrentTime;
      if (hls.streamController.mediaBuffer) {
        nearestBufferSegInfo = getNearestBufferSegmentInfo(hls.streamController.mediaBuffer.buffered, currentTime);
      }
    }

    return {
      ...this._vidi.attachedStream.mediaStream,
      bitrates,
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo
    };
  }

  _getNativeInfo(vidi) {
    const { videoElement: { buffered, currentTime } } = vidi;

    const overallBufferLength = geOverallBufferLength(buffered);
    const nearestBufferSegInfo = getNearestBufferSegmentInfo(buffered, currentTime);
    let bitrates;
    let currentBitrate;
    if (vidi.attachedStream) {
      bitrates = vidi.attachedStream.mediaStreams;
      currentBitrate = bitrates[0];
    }

    return {
      ...currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo
    };
  }

  _getViewDimensions() {
    return {
      width: this._video.offsetWidth,
      height: this._video.offsetHeight
    };
  }

  get isMetadataLoaded() {
    return this._isMetadataLoaded;
  }

  get isPreloadAvailable() {
    if (iPad || iPhone || iPod || Android) {
      return false;
    }

    return this.getPreload() !== 'none';
  }

  get isAutoPlayAvailable() {
    if (iPad || iPhone || iPod || Android) {
      return false;
    }

    return this.getAutoPlay();
  }

  setSrc(src) {
    if (this._vidi.src !== src) {
      this._vidi.src = src;
      this._clearTimestamps();
      this._setState(STATES.SRC_SET);
    }
  }

  getState() {
    return this._currentState;
  }

  goForward(sec) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.min(current + sec, duration));
    }
  }

  goBackward(sec) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.max(current - sec, 0));
    }
  }

  decreaseVolume(value) {
    this.setVolume(this.getVolume() - value);
  }

  increaseVolume(value) {
    this.setVolume(this.getVolume() + value);
  }

  setAutoPlay(isAutoPlay) {
    this._video.autoplay = Boolean(isAutoPlay);
  }

  getAutoPlay() {
    return this._video.autoplay;
  }

  setLoop(isLoop) {
    this._video.loop = Boolean(isLoop);
  }

  getLoop() {
    return this._video.loop;
  }

  setMute(isMuted) {
    this._video.muted = Boolean(isMuted);
  }

  getMute() {
    return this._video.muted;
  }

  setVolume(volume) {
    const parsedVolume = Number(volume);
    this._video.volume = isNaN(parsedVolume) ? 1 : Math.max(0, Math.min(Number(volume), 1));
  }

  getVolume() {
    return this._video.volume;
  }

  setPlaybackRate(rate) {
    this._video.playbackRate = rate;
  }

  getPlaybackRate() {
    return this._video.playbackRate;
  }

  setPreload(preload) {
    this._video.preload = preload || 'auto';
  }

  getPreload() {
    return this._video.preload;
  }

  getReadyState() {
    return this._video.readyState;
  }

  getCurrentTime() {
    return this._video.currentTime;
  }

  setCurrentTime(time) {
    this._video.currentTime = time;
  }

  getDurationTime() {
    return this._video.duration || 0;
  }

  getBuffered() {
    return this._video.buffered;
  }

  setPlayInline(isPlayInline) {
    return this._video.setAttribute('playsInline', isPlayInline);
  }

  getPlayInline() {
    return this._video.getAttribute('playsInline');
  }

  destroy() {
    this._unbindEvents();
    this._video.remove();

    delete this._eventEmitter;
    delete this._video;

    this._vidi.setVideoElement();
    delete this._vidi;
  }

  play() {
    //Workaround for triggering functionality that requires user event pipe
    this._eventEmitter.emit(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED);
    this._vidi.play();
  }

  pause() {
    this._vidi.pause();
  }
}
