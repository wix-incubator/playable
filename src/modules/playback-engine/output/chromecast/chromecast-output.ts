import {
  CrossOriginValue,
  IPlayableSource,
  IVideoOutput,
  PlayableMediaSource,
  PreloadType,
} from '../../types';
import RemotePlayerController = cast.framework.RemotePlayerController;
import RemotePlayer = cast.framework.RemotePlayer;
import { EngineState } from '../../../../constants';
import StateEngine from './state-engine';
import { IEventEmitter } from '../../../event-emitter/types';
import logger from '../../../../utils/logger';
import { getMimeByType, getMimeByUrl } from '../../../../utils/get-mime-type';
import { ICromecastDebugInfo } from './types';

const NOT_IMPLEMENTED = 'Not available using chromecast';

export default class ChromecastOutput implements IVideoOutput {
  type: string;

  private _playerController: RemotePlayerController;
  private _player: RemotePlayer;
  private _stateEngine: StateEngine;
  private _eventEmitter: IEventEmitter;
  private _src: string;

  private _isAutoplay: boolean;

  constructor(eventEmitter: IEventEmitter) {
    this._eventEmitter = eventEmitter;

    this._initRemote();
  }

  play() {
    if (this.isPaused) {
      this._playerController.playOrPause();
    }

    return Promise.resolve();
  }

  pause() {
    if (!this.isPaused) {
      this._playerController.playOrPause();
    }
  }

  setMute(mute: boolean) {
    if (mute === undefined) {
      return;
    }

    if (mute !== this.isMuted) {
      this._playerController.muteOrUnmute();
    }
  }

  setAutoplay(isAutoplay: boolean) {
    this._isAutoplay = isAutoplay;
  }

  setInline() {
    logger.warn(NOT_IMPLEMENTED);
  }

  setCrossOrigin() {
    logger.warn(NOT_IMPLEMENTED);
  }

  setCurrentTime(time: number) {
    this._player.currentTime = time;
    this._playerController.seek();
  }

  setVolume(volume: number) {
    if (this._player.volumeLevel === volume) {
      return;
    }

    this._player.volumeLevel = volume;
    this._playerController.setVolumeLevel();
  }

  setLoop() {
    logger.warn(NOT_IMPLEMENTED);
  }

  setPlaybackRate() {
    // TODO: https://developers.google.com/cast/docs/reference/chrome/chrome.cast.media.Media#playbackRate
    // Works only via receiver API
    logger.warn(NOT_IMPLEMENTED);
  }

  setPreload() {
    logger.warn(NOT_IMPLEMENTED);
  }

  setSrc(source: PlayableMediaSource) {
    if (!source) {
      return;
    }

    let calculatedSource = source;
    let mimeType, url;

    if (Array.isArray(source)) {
      calculatedSource = source[0];
    }

    if (typeof calculatedSource === 'string') {
      url = calculatedSource;
      mimeType = getMimeByUrl(calculatedSource);
    } else {
      calculatedSource = calculatedSource as IPlayableSource;
      mimeType = getMimeByType(calculatedSource.type);
      url = calculatedSource.url;
    }

    this._src = url;

    const session = cast.framework.CastContext.getInstance().getCurrentSession();
    const mediaInfo = new chrome.cast.media.MediaInfo(url, mimeType);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);

    this._stateEngine.setState(EngineState.SRC_SET);

    return session.loadMedia(request).then(() => {
      this._initRemote();
      this._stateEngine.setState(EngineState.PLAYING);
    });
  }

  private _initRemote() {
    this._player = new cast.framework.RemotePlayer();
    this._playerController = new cast.framework.RemotePlayerController(
      this._player,
    );

    this._stateEngine = new StateEngine(
      this._eventEmitter,
      this,
      this._playerController,
    );
  }

  getElement(): null {
    logger.warn(NOT_IMPLEMENTED);
    return null;
  }

  getDebugInfo() {
    return {
      output: 'chromecast',
      currentTime: this.currentTime,
      duration: this.duration,
      src: this.src,
    } as ICromecastDebugInfo;
  }

  get volume() {
    return this._player.volumeLevel;
  }

  get currentTime() {
    return this._player.currentTime;
  }

  get duration() {
    return this._player.duration;
  }

  get autoplay() {
    return this._isAutoplay;
  }

  get crossOrigin() {
    logger.warn(NOT_IMPLEMENTED);
    return 'anonymous' as CrossOriginValue;
  }

  get playbackRate() {
    return 1;
  }

  get buffered() {
    return {
      end: () => 0,
      start: () => 0,
      length: 0,
    };
  }

  get preload() {
    return PreloadType.AUTO;
  }

  get isPaused() {
    return this._player.isPaused;
  }

  get isMuted() {
    return this._player.isMuted;
  }

  get isEnded() {
    return this._stateEngine.state === EngineState.ENDED;
  }

  get isInline() {
    return false;
  }

  get isAutoplay() {
    return this._isAutoplay;
  }

  get isSeekAvailable() {
    return this._player.canSeek;
  }

  get isLoop() {
    return false;
  }

  get isPreloadActive() {
    return false;
  }

  get videoHeight() {
    return 0;
  }

  get videoWidth() {
    return 0;
  }

  get src() {
    return this._src;
  }

  get currentState(): EngineState {
    return this._stateEngine.state;
  }

  get isAutoPlayActive() {
    return false;
  }

  get isDynamicContent() {
    return false;
  }

  get isDynamicContentEnded() {
    return false;
  }

  get isMetadataLoaded() {
    return true;
  }

  get isSyncWithLive() {
    return false;
  }

  syncWithLive() {
    logger.warn(NOT_IMPLEMENTED);
  }
}
