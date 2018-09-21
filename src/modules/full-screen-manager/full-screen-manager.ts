import { isIOS } from '../../utils/device-detection';
import playerAPI from '../../core/player-api-decorator';
import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';

import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../constants';
import {
  IFullScreenManager,
  IFullScreenHelper,
  IFullScreenConfig,
} from './types';
import { IEventEmitter } from '../event-emitter/types';
import { IPlaybackEngine } from '../playback-engine/types';
import { IPlayerConfig } from '../../core/config';
import { IRootContainer } from '../root-container/types';

const DEFAULT_CONFIG: IFullScreenConfig = {
  exitFullScreenOnEnd: true,
  enterFullScreenOnPlay: false,
  exitFullScreenOnPause: false,
  pauseVideoOnFullScreenExit: false,
};

export default class FullScreenManager implements IFullScreenManager {
  static moduleName = 'fullScreenManager';
  static dependencies = ['eventEmitter', 'engine', 'rootContainer', 'config'];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _helper: IFullScreenHelper;

  private _exitFullScreenOnEnd: boolean = false;
  private _enterFullScreenOnPlay: boolean = false;
  private _exitFullScreenOnPause: boolean = false;
  private _pauseVideoOnFullScreenExit: boolean = false;

  private _isEnabled: boolean;

  private _unbindEvents: Function;

  constructor({
    eventEmitter,
    engine,
    rootContainer,
    config,
  }: {
    engine: IPlaybackEngine;
    eventEmitter: IEventEmitter;
    rootContainer: IRootContainer;
    config: IPlayerConfig;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    if (config.disableFullScreen) {
      this._isEnabled = false;
    } else {
      this._isEnabled = true;
      const _config: IFullScreenConfig = {
        ...DEFAULT_CONFIG,
      };

      this._exitFullScreenOnEnd = _config.exitFullScreenOnEnd;
      this._enterFullScreenOnPlay = _config.enterFullScreenOnPlay;
      this._exitFullScreenOnPause = _config.exitFullScreenOnPause;
      this._pauseVideoOnFullScreenExit = _config.pauseVideoOnFullScreenExit;
    }
    this._onChange = this._onChange.bind(this);

    if (isIOS()) {
      this._helper = new IOSFullScreen(
        this._engine.getElement(),
        this._onChange,
      );
    } else {
      this._helper = new DesktopFullScreen(
        rootContainer.getElement(),
        this._onChange,
      );
    }

    this._bindEvents();
  }

  private _onChange() {
    if (!this._helper.isInFullScreen && this._pauseVideoOnFullScreenExit) {
      this._engine.pause();
    }
    this._eventEmitter.emit(
      UI_EVENTS.FULL_SCREEN_STATE_CHANGED,
      this._helper.isInFullScreen,
    );
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [VIDEO_EVENTS.STATE_CHANGED, this._processNextStateFromEngine],
        [VIDEO_EVENTS.PLAY_REQUEST, this._enterOnPlayRequested],
      ],
      this,
    );
  }

  private _exitOnEnd() {
    if (this._exitFullScreenOnEnd && this.isInFullScreen) {
      this.exitFullScreen();
    }
  }

  private _enterOnPlayRequested() {
    if (this._enterFullScreenOnPlay && !this.isInFullScreen) {
      this.enterFullScreen();
    }
  }

  private _exitOnPauseRequested() {
    if (this._exitFullScreenOnPause && this.isInFullScreen) {
      this.exitFullScreen();
    }
  }

  private _processNextStateFromEngine({
    nextState,
  }: {
    nextState: EngineState;
  }) {
    switch (nextState) {
      case EngineState.ENDED: {
        this._exitOnEnd();
        break;
      }
      case EngineState.PAUSED: {
        this._exitOnPauseRequested();
        break;
      }

      /* ignore coverage */
      default:
        break;
    }
  }

  /**
   * Allow player try to exit full screen on pause
   * @example
   * player.play();
   * player.enableExitFullScreenOnPause();
   * player.enterFullScreen();
   * console.log(player.isInFullScreen) // true
   * player.pause();
   * console.log(player.isInFullScreen) // false
   */
  @playerAPI()
  enableExitFullScreenOnPause() {
    this._exitFullScreenOnPause = true;
  }

  /**
   * Disallow player to exit full screen on pause
   * @example
   * player.play();
   * player.disableExitFullScreenOnPause();
   * player.enterFullScreen();
   * console.log(player.isInFullScreen) // true
   * player.pause();
   * console.log(player.isInFullScreen) // true
   */
  @playerAPI()
  disableExitFullScreenOnPause() {
    this._exitFullScreenOnPause = false;
  }

  /**
   * Allow player try to exit full screen on end
   * @example
   * player.play();
   * player.enableExitFullScreenOnEnd();
   * player.enterFullScreen();
   * console.log(player.isInFullScreen) // true
   * console.log(player.isEnded); // true
   * console.log(player.isInFullScreen) // false
   */
  @playerAPI()
  enableExitFullScreenOnEnd() {
    this._exitFullScreenOnEnd = true;
  }

  /**
   * Disallow player try to exit full screen on end
   * @example
   * player.play();
   * player.disableExitFullScreenOnEnd();
   * player.enterFullScreen();
   * console.log(player.isInFullScreen) // true
   * console.log(player.isEnded); // true
   * console.log(player.isInFullScreen) // true
   */
  @playerAPI()
  disableExitFullScreenOnEnd() {
    this._exitFullScreenOnPause = false;
  }

  /**
   * Allow player try to exit full screen on end
   * @example
   * player.enableEnterFullScreenOnPlay();
   * console.log(player.isInFullScreen) // false
   * player.play();
   * console.log(player.isInFullScreen) // true
   */
  @playerAPI()
  enableEnterFullScreenOnPlay() {
    this._enterFullScreenOnPlay = true;
  }

  /**
   * Disallow player try to exit full screen on end
   * @example
   * player.disableEnterFullScreenOnPlay();
   * console.log(player.isInFullScreen) // false
   * player.play();
   * console.log(player.isInFullScreen) // false
   */
  @playerAPI()
  disableEnterFullScreenOnPlay() {
    this._enterFullScreenOnPlay = false;
  }

  /**
   * Allow player try to exit full screen on end
   * @example
   * player.play();
   * player.enablePauseVideoOnFullScreenExit();
   * player.enterFullScreen();
   * console.log(player.isInFullScreen) // true
   * player.pause();
   * console.log(player.isInFullScreen) // false
   */
  @playerAPI()
  enablePauseVideoOnFullScreenExit() {
    this._pauseVideoOnFullScreenExit = true;
  }

  /**
   * Disallow player try to exit full screen on end
   * @example
   * player.play();
   * player.enablePauseVideoOnFullScreenExit();
   * player.enterFullScreen();
   * console.log(player.isInFullScreen) // true
   * player.pause();
   * console.log(player.isInFullScreen) // true
   */
  @playerAPI()
  disablePauseVideoOnFullScreenExit() {
    this._pauseVideoOnFullScreenExit = false;
  }

  /**
   * Player would try to enter fullscreen mode.
   * Behavior of fullscreen mode on different platforms may differ.
   * @example
   * player.enterFullScreen();
   */
  @playerAPI()
  enterFullScreen() {
    if (!this.isEnabled) {
      return;
    }

    this._helper.request();
  }

  /**
   * Player would try to exit fullscreen mode.
   * @example
   * player.exitFullScreen();
   */
  @playerAPI()
  exitFullScreen() {
    if (!this.isEnabled) {
      return;
    }

    this._helper.exit();
  }

  /**
   * Return true if player is in full screen
   * @example
   * console.log(player.isInFullScreen); // false
   */
  @playerAPI()
  get isInFullScreen(): boolean {
    if (!this.isEnabled) {
      return false;
    }

    return this._helper.isInFullScreen;
  }

  get isEnabled() {
    return this._helper.isEnabled && this._isEnabled;
  }

  destroy() {
    this._unbindEvents();

    this._helper.destroy();
    this._helper = null;

    this._eventEmitter = null;
    this._engine = null;
  }
}
