import publicAPI from '../../utils/public-api-decorator';

import StateEngine, { STATES } from './state-engine';
import NativeEventsBroadcaster from './native-events-broadcaster';
import MediaStreamsStrategy from './media-streams-strategy';

import { iPhone, iPod, Android, iPad } from '../../utils/device-detection';

import { VIDEO_EVENTS } from '../../constants/index';


//TODO: Find source of problem with native HLS on Safari, when playing state triggered but actual playing is delayed
export default class Engine {
  static dependencies = ['eventEmitter', 'config'];

  constructor({ eventEmitter, config }) {
    this._eventEmitter = eventEmitter;

    this.STATES = STATES;

    this.currentSrc = null;

    this._createVideoTag(config.engine);

    this._stateEngine = new StateEngine(eventEmitter, this._video);
    this._nativeEventsBroadcaster = new NativeEventsBroadcaster(eventEmitter, this._video);
    this._mediaStreamStrategy = new MediaStreamsStrategy(eventEmitter, this._video);

    this._applyConfig(config.engine);
  }

  _createVideoTag() {
    this._video = document.createElement('video');
  }

  _applyConfig(config = {}) {
    const { preload, autoPlay, loop, muted, volume, playInline, src } = config;

    this.setPreload(preload);
    this.setAutoPlay(autoPlay);
    this.setLoop(loop);
    this.setMute(muted);
    this.setVolume(volume);
    this.setPlayInline(playInline);
    this.setSrc(src);
  }

  getNode() {
    return this._video;
  }

  _getViewDimensions() {
    return {
      width: this._video.offsetWidth,
      height: this._video.offsetHeight
    };
  }

  get isMetadataLoaded() {
    return this._stateEngine.isMetadataLoaded;
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

  @publicAPI()
  getDebugInfo() {
    const { duration, currentTime } = this._video;
    let data;

    if (this._mediaStreamStrategy.attachedStream) {
      data = this._mediaStreamStrategy.attachedStream.getDebugInfo();
    }

    return {
      ...data,
      viewDimensions: this._getViewDimensions(),
      currentTime,
      duration,
      loadingStateTimestamps: this._stateEngine.getStateTimestamps()
    };
  }

  @publicAPI()
  setSrc(src) {
    if (src === this.currentSrc) {
      return;
    }

    this._stateEngine.clearTimestamps();

    this.currentSrc = src;
    this._mediaStreamStrategy.connectMediaStream(this.currentSrc);

    this._stateEngine.setState(STATES.SRC_SET);
  }

  @publicAPI()
  getSrc() {
    return this.currentSrc;
  }

  @publicAPI()
  goForward(sec) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.min(current + sec, duration));
    }
  }

  @publicAPI()
  goBackward(sec) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.max(current - sec, 0));
    }
  }

  @publicAPI()
  decreaseVolume(value) {
    this.setVolume(this.getVolume() - value);
  }

  @publicAPI()
  increaseVolume(value) {
    this.setVolume(this.getVolume() + value);
  }

  setInitialBitrate(bitrate) {
    this._mediaStreamStrategy.setInitialBitrate(bitrate);
  }

  @publicAPI()
  setAutoPlay(isAutoPlay) {
    this._video.autoplay = Boolean(isAutoPlay);
  }

  @publicAPI()
  getAutoPlay() {
    return this._video.autoplay;
  }

  @publicAPI()
  setLoop(isLoop) {
    this._video.loop = Boolean(isLoop);
  }

  @publicAPI()
  getLoop() {
    return this._video.loop;
  }

  @publicAPI()
  setMute(isMuted) {
    this._video.muted = Boolean(isMuted);
  }

  @publicAPI()
  getMute() {
    return this._video.muted;
  }

  @publicAPI()
  setVolume(volume) {
    const parsedVolume = Number(volume);
    this._video.volume = isNaN(parsedVolume) ? 1 : Math.max(0, Math.min(Number(volume) / 100, 1));
  }

  @publicAPI()
  getVolume() {
    return this._video.volume * 100;
  }

  @publicAPI()
  setPlaybackRate(rate) {
    this._video.playbackRate = rate;
  }

  @publicAPI()
  getPlaybackRate() {
    return this._video.playbackRate;
  }

  @publicAPI()
  setPreload(preload) {
    this._video.preload = preload || 'auto';
  }

  @publicAPI()
  getPreload() {
    return this._video.preload;
  }

  @publicAPI()
  getCurrentTime() {
    return this._video.currentTime;
  }

  @publicAPI()
  setCurrentTime(time) {
    this._video.currentTime = time;
  }

  @publicAPI()
  getDurationTime() {
    return this._video.duration || 0;
  }

  getBuffered() {
    return this._video.buffered;
  }

  @publicAPI()
  setPlayInline(isPlayInline) {
    if (isPlayInline) {
      this._video.setAttribute('playsInline', isPlayInline);
    }
  }

  @publicAPI()
  getPlayInline() {
    return this._video.getAttribute('playsInline');
  }

  @publicAPI('getCurrentPlaybackState')
  getCurrentState() {
    return this._stateEngine.getState();
  }

  @publicAPI()
  play() {
    //Workaround for triggering functionality that requires user event pipe
    this._eventEmitter.emit(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED);

    this._pauseRequested = false;

    if (!this._playPromise) {
      this._playPromise = this._video.play();
      if (this._playPromise !== undefined) {
        this._playPromise
          .then(() => {
            this._playPromise = null;

            if (this._pauseRequested) {
              this.pause();
            }
          })
          .catch(() => {
            this._playPromise = null;
          });
      }
    }
  }

  @publicAPI()
  pause() {
    if (this._playPromise) {
      this._pauseRequested = true;
    } else {
      this._video.pause();
      this._pauseRequested = false;
    }
  }

  destroy() {
    this._stateEngine.destroy();
    this._nativeEventsBroadcaster.destroy();
    this._mediaStreamStrategy.destroy();

    delete this._stateEngine;
    delete this._nativeEventsBroadcaster;
    delete this._mediaStreamStrategy;

    this._video.parentNode && this._video.parentNode.removeChild(this._video);

    delete this._eventEmitter;
    delete this._video;
  }
}
