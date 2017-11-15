import playerAPI from '../../utils/player-api-decorator';

import StateEngine from './state-engine';
import NativeEventsBroadcaster from './native-events-broadcaster';
import AdapterStrategy from './adapters-strategy';

import { isIPhone, isIPod, isIPad, isAndroid } from '../../utils/device-detection';

import { VIDEO_EVENTS, STATES } from '../../constants/index';

export {
  STATES
};

//TODO: Find source of problem with native HLS on Safari, when playing state triggered but actual playing is delayed
export default class Engine {
  static dependencies = ['eventEmitter', 'config', 'availablePlaybackAdapters'];

  private _eventEmitter;
  private _currentSrc;
  private _stateEngine;
  private _video;
  private _nativeEventsBroadcaster;
  private _adapterStrategy;
  private _playPromise: Promise<any>;
  private _pauseRequested: boolean;

  constructor({ eventEmitter, config, availablePlaybackAdapters = [] }) {
    this._eventEmitter = eventEmitter;

    this._currentSrc = null;

    this._createVideoTag();

    this._stateEngine = new StateEngine(eventEmitter, this._video);
    this._nativeEventsBroadcaster = new NativeEventsBroadcaster(eventEmitter, this._video);
    this._adapterStrategy = new AdapterStrategy(this._eventEmitter, this._video, availablePlaybackAdapters);

    this._applyConfig(config.engine);
  }

  _createVideoTag(engine?) {
    this._video = document.createElement('video');
  }

  _applyConfig(config: any = {}) {
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

  get isDynamicContent() {
    if (!this.attachedAdapter) {
      return false;
    }

    return this.attachedAdapter.isDynamicContent;
  }

  get isSeekAvailable() {
    if (!this.attachedAdapter) {
      return false;
    }

    return this.attachedAdapter.isSeekAvailable;
  }

  get isMetadataLoaded() {
    return this._stateEngine.isMetadataLoaded;
  }

  get isPreloadAvailable() {
    if (isIPad() || isIPhone() || isIPod() || isAndroid()) {
      return false;
    }

    return this.getPreload() !== 'none';
  }

  get isAutoPlayAvailable() {
    if (isIPad() || isIPhone() || isIPod() || isAndroid()) {
      return false;
    }

    return this.getAutoPlay();
  }

  get attachedAdapter() {
    return this._adapterStrategy.attachedAdapter;
  }

  @playerAPI()
  getDebugInfo() {
    const { duration, currentTime } = this._video;
    let data;

    if (this._adapterStrategy.attachedAdapter) {
      data = this._adapterStrategy.attachedAdapter.debugInfo;
    }

    return {
      ...data,
      viewDimensions: this._getViewDimensions(),
      currentTime,
      duration,
      loadingStateTimestamps: this._stateEngine.getStateTimestamps()
    };
  }

  @playerAPI()
  setSrc(src) {
    if (src === this._currentSrc) {
      return;
    }

    this._stateEngine.clearTimestamps();

    this._currentSrc = src;
    this._adapterStrategy.connectAdapter(this._currentSrc);

    this._stateEngine.setState(STATES.SRC_SET);
  }

  @playerAPI()
  getSrc() {
    return this._currentSrc;
  }

  @playerAPI()
  goLive() {
    this.setCurrentTime(this.attachedAdapter.livePosition);

    this.play();
  }

  @playerAPI()
  goForward(sec) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.min(current + sec, duration));
    }
  }

  @playerAPI()
  goBackward(sec) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.max(current - sec, 0));
    }
  }

  @playerAPI()
  decreaseVolume(value) {
    this.setVolume(this.getVolume() - value);
  }

  @playerAPI()
  increaseVolume(value) {
    this.setVolume(this.getVolume() + value);
  }

  @playerAPI()
  setAutoPlay(isAutoPlay) {
    this._video.autoplay = Boolean(isAutoPlay);
  }

  @playerAPI()
  getAutoPlay() {
    return this._video.autoplay;
  }

  @playerAPI()
  setLoop(isLoop) {
    this._video.loop = Boolean(isLoop);
  }

  @playerAPI()
  getLoop() {
    return this._video.loop;
  }

  @playerAPI()
  setMute(isMuted) {
    this._video.muted = Boolean(isMuted);
  }

  @playerAPI()
  getMute() {
    return this._video.muted;
  }

  @playerAPI()
  setVolume(volume) {
    const parsedVolume = Number(volume);
    this._video.volume = isNaN(parsedVolume) ? 1 : Math.max(0, Math.min(Number(volume) / 100, 1));
  }

  @playerAPI()
  getVolume() {
    return this._video.volume * 100;
  }

  @playerAPI()
  setPlaybackRate(rate) {
    this._video.playbackRate = rate;
  }

  @playerAPI()
  getPlaybackRate() {
    return this._video.playbackRate;
  }

  @playerAPI()
  setPreload(preload) {
    this._video.preload = preload || 'auto';
  }

  @playerAPI()
  getPreload() {
    return this._video.preload;
  }

  @playerAPI()
  getCurrentTime() {
    return this._video.currentTime;
  }

  @playerAPI('goTo')
  setCurrentTime(time) {
    this._video.currentTime = time;
  }

  @playerAPI()
  getDurationTime() {
    return this._video.duration || 0;
  }

  getBuffered() {
    return this._video.buffered;
  }

  @playerAPI()
  setPlayInline(isPlayInline) {
    if (isPlayInline) {
      this._video.setAttribute('playsInline', isPlayInline);
    }
  }

  @playerAPI()
  getPlayInline() {
    return this._video.getAttribute('playsInline');
  }

  @playerAPI('getCurrentPlaybackState')
  getCurrentState() {
    return this._stateEngine.getState();
  }

  @playerAPI()
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

  @playerAPI()
  pause() {
    if (this._playPromise) {
      this._pauseRequested = true;
    } else {
      this._video.pause();
      this._pauseRequested = false;
    }
  }

  @playerAPI()
  togglePlayback() {
    const state = this.getCurrentState();

    if (
      state === STATES.PLAY_REQUESTED ||
      state === STATES.PLAYING
    ) {
      this.pause();
    } else {
      this.play();
    }
  }

  destroy() {
    this._stateEngine.destroy();
    this._nativeEventsBroadcaster.destroy();
    this._adapterStrategy.destroy();
    this._video.parentNode && this._video.parentNode.removeChild(this._video);

    delete this._stateEngine;
    delete this._nativeEventsBroadcaster;
    delete this._adapterStrategy;
    delete this._eventEmitter;
    delete this._video;
  }
}
