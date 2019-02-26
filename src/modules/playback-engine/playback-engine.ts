import playerAPI from '../../core/player-api-decorator';

import StateEngine from './state-engine';
import NativeEventsBroadcaster from './native-events-broadcaster';
import AdapterStrategy from './adapters-strategy';
import NativeOutput from './output/native';

import {
  isIPhone,
  isIPod,
  isIPad,
  isAndroid,
} from '../../utils/device-detection';

import { VIDEO_EVENTS, EngineState } from '../../constants';
import { IPlaybackAdapter } from './adapters/types';

import { IPlayerConfig } from '../../core/config';
import {
  IPlaybackEngine,
  IPlaybackEngineDependencies,
  IEngineDebugInfo,
  IVideoOutput,
  MediaSource,
  CrossOriginValue,
} from './types';
import { IEventEmitter } from '../event-emitter/types';

//TODO: Find source of problem with native HLS on Safari, when playing state triggered but actual playing is delayed
export default class Engine implements IPlaybackEngine {
  static moduleName = 'engine';
  static dependencies = ['eventEmitter', 'config', 'availablePlaybackAdapters'];

  private _eventEmitter: IEventEmitter;
  private _currentSrc: MediaSource;
  private _stateEngine: StateEngine;
  private _output: IVideoOutput;
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

    this._output = new NativeOutput(config.videoElement);

    this._stateEngine = new StateEngine(eventEmitter, this._output);
    this._nativeEventsBroadcaster = new NativeEventsBroadcaster(
      eventEmitter,
      this._output,
    );
    this._adapterStrategy = new AdapterStrategy(
      this._eventEmitter,
      this._output,
      availablePlaybackAdapters,
    );

    this._applyConfig(config);
  }

  private _applyConfig(config: IPlayerConfig = {}) {
    const {
      preload,
      autoplay,
      loop,
      muted,
      volume,
      playsinline,
      crossOrigin,
      src,
    } = config;

    this.setPreload(preload);
    this.setAutoplay(autoplay);
    this.setLoop(loop);
    this.setMute(muted);
    this.setVolume(volume);
    this.setPlaysinline(playsinline);
    this.setCrossOrigin(crossOrigin);

    this.setSrc(src);
  }

  getElement() {
    return this._output.getElement();
  }

  private _getViewDimensions() {
    return this._output.getViewDimensions;
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

    return this.getAutoplay();
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

  @playerAPI()
  reset() {
    this.pause();
    this.seekTo(0);
    this._eventEmitter.emit(VIDEO_EVENTS.RESET);
  }

  /**
   * Method for starting playback of video
   * @example
   * player.play();
   */
  @playerAPI()
  play() {
    //Workaround for triggering functionality that requires user event pipe
    this._eventEmitter.emit(VIDEO_EVENTS.PLAY_REQUEST);

    this._pauseRequested = false;

    if (!this._playPromise) {
      this._playPromise = this._output.play();
      if (this._playPromise !== undefined) {
        this._playPromise
          .then(() => {
            this._playPromise = null;

            if (this._pauseRequested) {
              this.pause();
            }
          })
          .catch((event: DOMException) => {
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
      this._output.pause();
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
    if (this.isPaused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Method for reseting playback of video
   * @example
   * player.play();
   * console.log(player.isPaused); // false
   * ...
   * player.resetPlayback();
   * console.log(player.isPaused); // true;
   * console.log(player.getCurrentTime()); //0;
   */
  @playerAPI()
  resetPlayback() {
    this.pause();
    this.seekTo(0);
    this._eventEmitter.emit(VIDEO_EVENTS.RESET);
  }

  /**
   * High level state of video playback. Returns true if playback is paused.
   * For more advance state use `getPlaybackState`
   * @example
   * player.play();
   * console.log(player.isPaused);
   */
  @playerAPI()
  get isPaused(): boolean {
    return this._output.isPaused;
  }

  /**
   * High level state of video playback. Returns true if playback is ended. Also note, that `isPaused` will return `true` if playback is ended also.
   * For more advance state use `getPlaybackState`
   * @example
   * player.play();
   * console.log(player.isEnded);
   */
  @playerAPI()
  get isEnded(): boolean {
    return this._output.isEnded;
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
      this.seekTo(this.attachedAdapter.syncWithLiveTime);

      this.play();
    }
  }

  /**
   * Method for going forward in playback by your value
   * @param sec - Value in seconds
   * @example
   * player.seekForward(5);
   */
  @playerAPI()
  seekForward(sec: number) {
    const duration = this.getDuration();

    if (duration) {
      const current = this.getCurrentTime();
      this.seekTo(Math.min(current + sec, duration));
    }
  }

  /**
   * Method for going backward in playback by your value
   * @param sec - Value in seconds
   * @example
   * player.seekBackward(5);
   */
  @playerAPI()
  seekBackward(sec: number) {
    const duration = this.getDuration();

    if (duration) {
      const current = this.getCurrentTime();
      this.seekTo(Math.max(current - sec, 0));
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
    const newVolume = isNaN(parsedVolume)
      ? 1
      : Math.max(0, Math.min(Number(volume) / 100, 1));

    this._output.setVolume(newVolume);
    //Workaround for problem with HTML5Video not firing volumechange if source changed right after volume/muted changed
    this._nativeEventsBroadcaster.checkVolumeChangeAfterLoadStart();
  }

  /**
   * Get volume
   * @example
   * player.getVolume(); // 50
   */
  @playerAPI()
  getVolume(): number {
    return this._output.volume * 100;
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

  setMute(isMuted: boolean) {
    this._output.setMute(isMuted);
    //Workaround for problem with HTML5Video not firing volumechange if source changed right after volume/muted changed
    this._nativeEventsBroadcaster.checkVolumeChangeAfterLoadStart();
  }

  /**
   * Mute the video
   * @example
   * player.mute();
   */
  @playerAPI()
  mute() {
    this.setMute(true);
  }

  /**
   * Unmute the video
   * @example
   * player.unmute(true);
   */
  @playerAPI()
  unmute() {
    this.setMute(false);
  }

  /**
   * Get mute flag
   * @example
   * player.mute();
   * player.isMuted; // true
   * player.unmute();
   * player.isMuted: // false
   */
  @playerAPI()
  get isMuted(): boolean {
    return this._output.isMuted;
  }

  /**
   * Set autoplay flag
   * @example
   * player.setAutoplay();
   */
  @playerAPI()
  setAutoplay(isAutoplay: boolean) {
    this._output.setAutoplay(isAutoplay);
  }

  /**
   * Get autoplay flag
   * @example
   * player.getAutoplay(); // true
   */
  @playerAPI()
  getAutoplay(): boolean {
    return this._output.isAutoplay;
  }

  /**
   * Set loop flag
   * @param isLoop - If `true` video will be played again after it will finish
   * @example
   * player.setLoop(true);
   */
  @playerAPI()
  setLoop(isLoop: boolean) {
    this._output.setLoop(isLoop);
  }

  /**
   * Get loop flag
   * @example
   * player.getLoop(); // true
   */
  @playerAPI()
  getLoop(): boolean {
    return this._output.isLoop;
  }

  /**
   * Method for setting playback rate
   */
  @playerAPI()
  setPlaybackRate(rate: number) {
    this._output.setPlaybackRate(rate);
  }

  /**
   * Return current playback rate
   */
  @playerAPI()
  getPlaybackRate(): number {
    return this._output.playbackRate;
  }

  /**
   * Set preload type
   * @example
   * player.setPreload('none');
   */
  @playerAPI()
  setPreload(preload: 'auto' | 'metadata' | 'none' = 'auto') {
    this._output.setPreload(preload);
  }

  /**
   * Return preload type
   * @example
   * player.getPreload(); // none
   */
  @playerAPI()
  getPreload(): string {
    return this._output.preload;
  }

  /**
   * Return current time of video playback
   * @example
   * player.getCurrentTime(); //  60.139683
   */
  @playerAPI()
  getCurrentTime(): number {
    return this._output.currentTime;
  }

  /**
   * Method for seeking to time in video
   * @param time - Time in seconds
   * @example
   * player.seekTo(34);
   */
  @playerAPI()
  seekTo(time: number) {
    this._output.setCurrentTime(time);
  }

  /**
   * Return duration of video
   * @example
   * player.getDuration(); // 180.149745
   */
  @playerAPI()
  getDuration(): number {
    return this._output.duration || 0;
  }

  /**
   * Return real width of video from metadata
   * @example
   * player.getVideoWidth(); // 400
   */
  @playerAPI('getVideoRealWidth')
  getVideoWidth(): number {
    return this._output.videoWidth;
  }

  /**
   * Return real height of video from metadata
   * @example
   * player.getVideoHeight(); // 225
   */
  @playerAPI('getVideoRealHeight')
  getVideoHeight(): number {
    return this._output.videoHeight;
  }

  getBuffered() {
    return this._output.buffered;
  }

  /**
   * Set playsinline flag
   * @param isPlaysinline - If `false` - video will be played in full screen, `true` - inline
   * @example
   * player.setPlaysinline(true);
   */
  @playerAPI()
  setPlaysinline(isPlaysinline: boolean) {
    this._output.setInline(isPlaysinline);
  }

  /**
   * Get playInline flag
   * @example
   * player.getPlayInline(); // true
   */
  @playerAPI()
  getPlaysinline(): boolean {
    return this._output.isInline;
  }

  /**
   * Set crossorigin attribute for video
   * @example
   * player.setCrossOrigin('anonymous');
   */
  @playerAPI()
  setCrossOrigin(crossOrigin?: 'anonymous' | 'use-credentials') {
    this._output.setCrossOrigin(crossOrigin);
  }

  /**
   * Get crossorigin attribute value for video
   * @example
   * player.getCrossOrigin(); // 'anonymous'
   */
  @playerAPI()
  getCrossOrigin(): CrossOriginValue {
    return this._output.crossOrigin;
  }

  /**
   * Return current state of playback
   */
  @playerAPI('getPlaybackState')
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
  getDebugInfo(): IEngineDebugInfo {
    const { duration, currentTime } = this._output;
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
    this._output.destroy();

    this._stateEngine = null;
    this._nativeEventsBroadcaster = null;
    this._adapterStrategy = null;
    this._eventEmitter = null;
    this._output = null;
  }
}
