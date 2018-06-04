import playerAPI from '../../core/player-api-decorator';

import StateEngine from './state-engine';
import NativeEventsBroadcaster from './native-events-broadcaster';
import AdapterStrategy from './adapters-strategy';

import {
  isIPhone,
  isIPod,
  isIPad,
  isAndroid,
} from '../../utils/device-detection';

import { VIDEO_EVENTS, EngineState } from '../../constants';
import { IPlaybackAdapter } from './adapters/types';

import {
  IPlaybackEngine,
  IPlaybackEngineDependencies,
  IDebugInfo,
  MediaSource,
} from './types';
import { IEventEmitter } from '../event-emitter/types';

//TODO: Find source of problem with native HLS on Safari, when playing state triggered but actual playing is delayed
export default class Engine implements IPlaybackEngine {
  static moduleName = 'engine';
  static dependencies = ['eventEmitter', 'config', 'availablePlaybackAdapters'];

  private _eventEmitter: IEventEmitter;
  private _currentSrc: MediaSource;
  private _stateEngine: StateEngine;
  private _video: HTMLVideoElement;
  private _nativeEventsBroadcaster: NativeEventsBroadcaster;
  private _adapterStrategy: AdapterStrategy;
  private _playPromise: Promise<any>;
  private _pauseRequested: boolean;

  constructor({
    eventEmitter,
    config,
    availablePlaybackAdapters = [],
  }: IPlaybackEngineDependencies) {
    this._eventEmitter = eventEmitter;

    this._currentSrc = null;

    this._createVideoTag(config.videoElement);

    this._stateEngine = new StateEngine(eventEmitter, this._video);
    this._nativeEventsBroadcaster = new NativeEventsBroadcaster(
      eventEmitter,
      this._video,
    );
    this._adapterStrategy = new AdapterStrategy(
      this._eventEmitter,
      this._video,
      availablePlaybackAdapters,
    );

    this._applyConfig(config);
  }

  private _createVideoTag(videoElement?: HTMLVideoElement) {
    if (videoElement && videoElement.tagName === 'VIDEO') {
      this._video = videoElement;
    } else {
      this._video = document.createElement('video');
    }
  }

  private _applyConfig(config: any = {}) {
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

  private _getViewDimensions() {
    return {
      width: this._video.offsetWidth,
      height: this._video.offsetHeight,
    };
  }

  get isDynamicContent() {
    if (!this.attachedAdapter) {
      return false;
    }

    return this.attachedAdapter.isDynamicContent;
  }

  get isDynamicContentEnded() {
    if (!this.attachedAdapter) {
      return false;
    }

    return this.attachedAdapter.isDynamicContentEnded;
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

  get isSyncWithLive(): boolean {
    if (!this.attachedAdapter) {
      return false;
    }

    return this.attachedAdapter.isSyncWithLive;
  }

  get attachedAdapter(): IPlaybackAdapter {
    return this._adapterStrategy.attachedAdapter;
  }

  /**
   * Method for setting source of video to player.
   * @param src Array with multiple sources
   * @example
   * player.setSrc([
   *   'https://my-url/video.mp4',
   *   'https://my-url/video.webm',
   *   'https://my-url/video.m3u8'
   * ]);
   * @note
   * Read more about [video source](/video-source)
   */
  @playerAPI()
  setSrc(src: MediaSource) {
    if (src === this._currentSrc) {
      return;
    }

    this._stateEngine.clearTimestamps();
    this._currentSrc = src;
    this._adapterStrategy.connectAdapter(this._currentSrc);

    this._stateEngine.setState(EngineState.SRC_SET);
  }

  /**
   * Return current source of video
   * @example
   * player.getSrc(); // ['https://my-url/video.mp4']
   */
  @playerAPI()
  getSrc(): MediaSource {
    return this._currentSrc;
  }

  /**
   * Method for starting playback of video
   * @example
   * player.play();
   */
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
          .catch(event => {
            this._eventEmitter.emit(VIDEO_EVENTS.PLAY_ABORTED, event);
            this._playPromise = null;
          });
      }
    }
  }

  /**
   * Method for pausing playback of video
   * @example
   * player.pause();
   */
  @playerAPI()
  pause() {
    if (this._playPromise) {
      this._pauseRequested = true;
    } else {
      this._video.pause();
      this._pauseRequested = false;
    }
  }

  /**
   * Method for toggling(play\pause) playback of video
   * @example
   * player.togglePlayback();
   */
  @playerAPI()
  togglePlayback() {
    if (this.isVideoPaused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Method for reseting playback of video
   * @example
   * player.play();
   * console.log(player.isVideoPaused); // false
   * ...
   * player.resetPlayback();
   * console.log(player.isVideoPaused); // true;
   * console.log(player.getCurrentTime()); //0;
   */
  @playerAPI()
  resetPlayback() {
    this.pause();
    this.setCurrentTime(0);
    this._eventEmitter.emit(VIDEO_EVENTS.RESET);
  }

  /**
   * High level status of video playback. Returns true if playback is paused.
   * For more advance state use `getCurrentPlaybackState`
   * @example
   * player.play();
   * console.log(player.isVideoPaused);
   */
  @playerAPI()
  get isVideoPaused(): boolean {
    return this._video.paused;
  }

  /**
   * High level status of video playback. Returns true if playback is ended. Also note, that `isPaused` will return `true` if playback is ended also.
   * For more advance state use `getCurrentPlaybackState`
   * @example
   * player.play();
   * console.log(player.isVideoEnded);
   */
  @playerAPI()
  get isVideoEnded(): boolean {
    return this._video.ended;
  }

  /**
   * Method for synchronize current playback with live point. Available only if you playing live source.
   * @example
   * player.syncWithLive();
   */
  @playerAPI()
  syncWithLive() {
    if (
      this.attachedAdapter &&
      this.attachedAdapter.isDynamicContent &&
      !this.attachedAdapter.isDynamicContentEnded &&
      !this.isSyncWithLive
    ) {
      this.setCurrentTime(this.attachedAdapter.syncWithLiveTime);

      this.play();
    }
  }

  /**
   * Method for going forward in playback by your value
   * @param sec - Value in seconds
   * @example
   * player.goForward(5);
   */
  @playerAPI()
  goForward(sec: number) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.min(current + sec, duration));
    }
  }

  /**
   * Method for going backward in playback by your value
   * @param sec - Value in seconds
   * @example
   * player.goBackward(5);
   */
  @playerAPI()
  goBackward(sec: number) {
    const duration = this.getDurationTime();

    if (duration) {
      const current = this.getCurrentTime();
      this.setCurrentTime(Math.max(current - sec, 0));
    }
  }

  /**
   * Set volume
   * @param volume - Volume value `0..100`
   * @example
   * player.setVolume(50);
   */
  @playerAPI()
  setVolume(volume: number) {
    const parsedVolume = Number(volume);
    this._video.volume = isNaN(parsedVolume)
      ? 1
      : Math.max(0, Math.min(Number(volume) / 100, 1));
  }

  /**
   * Get volume
   * @example
   * player.getVolume(); // 50
   */
  @playerAPI()
  getVolume(): number {
    return this._video.volume * 100;
  }

  /**
   * Method for increasing current volume by value
   * @param value - Value from 0 to 100
   * @example
   * player.increaseVolume(30);
   */
  @playerAPI()
  increaseVolume(value: number) {
    this.setVolume(this.getVolume() + value);
  }

  /**
   * Method for decreasing current volume by value
   * @param value - Value from 0 to 100
   * @example
   * player.decreaseVolume(30);
   */
  @playerAPI()
  decreaseVolume(value: number) {
    this.setVolume(this.getVolume() - value);
  }

  /**
   * Mute or unmute the video
   * @param isMuted - `true` to mute the video.
   * @example
   * player.setMute(true);
   */
  @playerAPI()
  setMute(isMuted: boolean) {
    this._video.muted = Boolean(isMuted);
  }

  /**
   * Get mute flag
   * @example
   * player.getMute(); // true
   */
  @playerAPI()
  getMute(): boolean {
    return this._video.muted;
  }

  /**
   * Set autoPlay flag
   * @example
   * player.setAutoPlay();
   */
  @playerAPI()
  setAutoPlay(isAutoPlay: boolean) {
    this._video.autoplay = Boolean(isAutoPlay);
  }

  /**
   * Get autoPlay flag
   * @example
   * player.getAutoPlay(); // true
   */
  @playerAPI()
  getAutoPlay(): boolean {
    return this._video.autoplay;
  }

  /**
   * Set loop flag
   * @param isLoop - If `true` video will be played again after it will finish
   * @example
   * player.setLoop(true);
   */
  @playerAPI()
  setLoop(isLoop: boolean) {
    this._video.loop = Boolean(isLoop);
  }

  /**
   * Get loop flag
   * @example
   * player.getLoop(); // true
   */
  @playerAPI()
  getLoop(): boolean {
    return this._video.loop;
  }

  /**
   * Method for setting playback rate
   */
  @playerAPI()
  setPlaybackRate(rate: number) {
    this._video.playbackRate = rate;
  }

  /**
   * Return current playback rate
   */
  @playerAPI()
  getPlaybackRate(): number {
    return this._video.playbackRate;
  }

  /**
   * Set preload type
   * @example
   * player.setPreload('none');
   */
  @playerAPI()
  setPreload(preload: 'auto' | 'metadata' | 'none') {
    this._video.preload = preload || 'auto';
  }

  /**
   * Return preload type
   * @example
   * player.getPreload(); // none
   */
  @playerAPI()
  getPreload(): string {
    return this._video.preload;
  }

  /**
   * Return current time of video playback
   * @example
   * player.getCurrentTime(); //  60.139683
   */
  @playerAPI()
  getCurrentTime(): number {
    return this._video.currentTime;
  }

  /**
   * Method for seeking to time in video
   * @param time - Time in seconds
   * @example
   * player.goTo(34);
   */
  @playerAPI('goTo')
  setCurrentTime(time: number) {
    this._video.currentTime = time;
  }

  /**
   * Return duration of video
   * @example
   * player.getDurationTime(); // 180.149745
   */
  @playerAPI()
  getDurationTime(): number {
    return this._video.duration || 0;
  }

  /**
   * Return real width of video from metadata
   * @example
   * player.getVideoWidth(); // 400
   */
  @playerAPI('getVideoRealWidth')
  getVideoWidth(): number {
    return this._video.videoWidth;
  }

  /**
   * Return real height of video from metadata
   * @example
   * player.getVideoHeight(); // 225
   */
  @playerAPI('getVideoRealHeight')
  getVideoHeight(): number {
    return this._video.videoHeight;
  }

  getBuffered() {
    return this._video.buffered;
  }

  /**
   * Set playInline flag
   * @param isPlayInline - If `false` - video will be played in full screen, `true` - inline
   * @example
   * player.setPlayInline(true);
   */
  @playerAPI()
  setPlayInline(isPlayInline: boolean) {
    if (isPlayInline) {
      this._video.setAttribute('playsInline', 'true');
    } else {
      this._video.removeAttribute('playsInline');
    }
  }

  /**
   * Get playInline flag
   * @example
   * player.getPlayInline(); // true
   */
  @playerAPI()
  getPlayInline(): boolean {
    return this._video.getAttribute('playsInline') === 'true';
  }

  /**
   * Return current state of playback
   */
  @playerAPI('getCurrentPlaybackState')
  getCurrentState() {
    return this._stateEngine.state;
  }

  /**
   * Return object with internal debug info
   *
   * @example
   * player.getDebugInfo();
   *
   * @note
   * The above command returns JSON structured like this:
   *
   * @example
   * {
   *   "type": "HLS",
   *   "viewDimensions": {
   *     "width": 700,
   *     "height": 394
   *   }
   *   "url": "https://example.com/video.m3u8",
   *   "currentTime": 22.092514,
   *   "duration": 60.139683,
   *   "loadingStateTimestamps": {
   *     "metadata-loaded": 76,
   *     "ready-to-play": 67
   *   },
   *   "bitrates": [
   *     // Available bitrates
   *     "100000",
   *     "200000",
   *     ...
   *   ],
   *   // One of available bitrates, that used right now
   *   "currentBitrate": "100000",
   *   // Raw estimation of bandwidth, that could be used without playback stall
   *   "bwEstimate": "120000"
   *   "overallBufferLength": 60.139683,
   *   "nearestBufferSegInfo": {
   *     "start": 0,
   *     "end": 60.139683
   *   }
   * }
   */
  @playerAPI()
  getDebugInfo(): IDebugInfo {
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
      loadingStateTimestamps: this._stateEngine.stateTimestamps,
    };
  }

  destroy() {
    this._stateEngine.destroy();
    this._nativeEventsBroadcaster.destroy();
    this._adapterStrategy.destroy();
    this._video.parentNode && this._video.parentNode.removeChild(this._video);

    this._stateEngine = null;
    this._nativeEventsBroadcaster = null;
    this._adapterStrategy = null;
    this._eventEmitter = null;
    this._video = null;
  }
}
