import {
  CrossOriginValue,
  INativeDebugInfo,
  IVideoOutput,
  PlayableMediaSource,
  PreloadType,
} from '../../types';
import { IPlaybackAdapter, IPlaybackAdapterClass } from './adapters/types';
import { IEventEmitter } from '../../../event-emitter/types';
import { IPlayerConfig } from '../../../../core/config';
import StateEngine from './state-engine';
import NativeEventsBroadcaster from './native-events-broadcaster';
import { EngineState } from '../../../../constants';
import AdapterStrategy from './adapters-strategy';
import VideoEvent from '../../../../constants/events/video';
import {
  isAndroid,
  isIPad,
  isIPhone,
  isIPod,
} from '../../../../utils/device-detection';

export default class NativeOutput implements IVideoOutput {
  static moduleName = 'nativeOutput';
  static dependencies = ['eventEmitter', 'config', 'availablePlaybackAdapters'];

  private _video: HTMLVideoElement;
  private _availablePlaybackAdapters: IPlaybackAdapterClass[];
  private _eventEmitter: IEventEmitter;
  private _stateEngine: StateEngine;
  private _nativeEventsBroadcaster: NativeEventsBroadcaster;
  private _adapterStrategy: AdapterStrategy;
  private _playPromise: Promise<any>;
  private _pauseRequested: boolean;

  constructor({
    eventEmitter,
    config,
    availablePlaybackAdapters = [],
  }: {
    eventEmitter: IEventEmitter;
    config: IPlayerConfig;
    availablePlaybackAdapters: IPlaybackAdapterClass[];
  }) {
    this._createVideoTag(config.videoElement);

    this._eventEmitter = eventEmitter;
    this._availablePlaybackAdapters = availablePlaybackAdapters;

    this._stateEngine = new StateEngine(this._eventEmitter, this._video);

    this._nativeEventsBroadcaster = new NativeEventsBroadcaster(
      eventEmitter,
      this._video,
    );

    this._adapterStrategy = new AdapterStrategy(
      this._eventEmitter,
      this._video,
      this._availablePlaybackAdapters,
    );
  }

  private _createVideoTag(videoElement: HTMLVideoElement) {
    if (videoElement && videoElement.tagName === 'VIDEO') {
      this._video = videoElement;
    } else {
      this._video = document.createElement('video');
    }
  }

  play() {
    //Workaround for triggering functionality that requires user event pipe
    this._eventEmitter.emitAsync(VideoEvent.PLAY_REQUEST);

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
          .catch((event: DOMException) => {
            this._eventEmitter.emitAsync(VideoEvent.PLAY_ABORTED, event);
            this._playPromise = null;
          });
      }
    }
  }

  pause() {
    if (this._playPromise) {
      this._pauseRequested = true;
    } else {
      this._video.pause();
      this._pauseRequested = false;
    }
  }

  setMute(mute: boolean) {
    this._video.muted = mute;
    //Workaround for problem with HTML5Video not firing volumechange if source changed right after volume/muted changed
    this._nativeEventsBroadcaster.checkVolumeChangeAfterLoadStart();
  }

  setAutoplay(isAutoplay: boolean) {
    this._video.autoplay = isAutoplay;
  }

  setInline(isPlaysinline: boolean) {
    if (isPlaysinline) {
      this._video.setAttribute('playsinline', 'true');
    } else {
      this._video.removeAttribute('playsinline');
    }
  }

  setCrossOrigin(crossOrigin?: CrossOriginValue) {
    if (crossOrigin) {
      this._video.setAttribute('crossorigin', crossOrigin);
    } else {
      this._video.removeAttribute('crossorigin');
    }
  }

  setCurrentTime(time: number) {
    this._video.currentTime = time;
  }

  setVolume(volume: number) {
    this._video.volume = volume;
    //Workaround for problem with HTML5Video not firing volumechange if source changed right after volume/muted changed
    this._nativeEventsBroadcaster.checkVolumeChangeAfterLoadStart();
  }

  setLoop(isLoop: boolean) {
    this._video.loop = isLoop;
  }

  setPlaybackRate(rate: number) {
    this._video.playbackRate = rate;
  }

  setPreload(preload: PreloadType = PreloadType.AUTO) {
    this._video.preload = preload || PreloadType.AUTO;
  }

  setSrc(src?: PlayableMediaSource) {
    this._stateEngine.clearTimestamps();
    this._adapterStrategy.connectAdapter(src);
    this._stateEngine.setState(EngineState.SRC_SET);
  }

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

  getElement() {
    return this._video;
  }

  private _getViewDimensions() {
    return {
      width: this._video.offsetWidth,
      height: this._video.offsetHeight,
    };
  }

  get volume() {
    return this._video.volume;
  }

  get currentTime() {
    return this._video.currentTime;
  }

  get duration() {
    return this._video.duration;
  }

  get autoplay() {
    return this._video.autoplay;
  }

  get crossOrigin() {
    return this._video.getAttribute('crossorigin') as CrossOriginValue;
  }

  get playbackRate() {
    return this._video.playbackRate;
  }

  get buffered() {
    return this._video.buffered;
  }

  get preload() {
    return this._video.preload as PreloadType;
  }

  get isPaused() {
    return this._video.paused;
  }

  get isMuted() {
    return Boolean(this._video.muted);
  }

  get isEnded() {
    return this._video.ended;
  }

  get isInline() {
    return Boolean(this._video.getAttribute('playsinline'));
  }

  get isAutoplay() {
    return this._video.autoplay;
  }

  get isLoop() {
    return this._video.loop;
  }

  get isMetadataLoaded() {
    return this._stateEngine.isMetadataLoaded;
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

  get isSyncWithLive(): boolean {
    if (!this.attachedAdapter) {
      return false;
    }

    return this.attachedAdapter.isSyncWithLive;
  }

  get isPreloadActive(): boolean {
    if (isIPad() || isIPhone() || isIPod() || isAndroid()) {
      return false;
    }

    return this.preload !== 'none';
  }

  get isAutoPlayActive() {
    if (isIPad() || isIPhone() || isIPod() || isAndroid()) {
      return false;
    }

    return this.isAutoplay;
  }

  get videoHeight() {
    return this._video.videoHeight;
  }

  get videoWidth() {
    return this._video.videoWidth;
  }

  get src() {
    return this.attachedAdapter && this.attachedAdapter.currentUrl;
  }

  get currentState() {
    return this._stateEngine.state;
  }

  get attachedAdapter(): IPlaybackAdapter {
    return this._adapterStrategy.attachedAdapter;
  }

  getDebugInfo(): INativeDebugInfo {
    const { duration, currentTime } = this;
    let adapterDebugInfo;

    if (this.attachedAdapter) {
      adapterDebugInfo = this.attachedAdapter.debugInfo;
    }

    return {
      ...adapterDebugInfo,
      duration,
      currentTime,
      loadingStateTimestamps: this._stateEngine.stateTimestamps,
      viewDimensions: this._getViewDimensions(),
      output: 'html5video',
    };
  }

  destroy() {
    this._nativeEventsBroadcaster.destroy();
    this._adapterStrategy.destroy();

    this._video.parentNode && this._video.parentNode.removeChild(this._video);

    this._video = null;
  }
}
