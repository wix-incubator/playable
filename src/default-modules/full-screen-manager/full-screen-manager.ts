import { isIPhone, isIPod, isIPad } from '../../utils/device-detection';
import playerAPI from '../../utils/player-api-decorator';
import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../constants/index';

export interface IFullScreenConfig {
  exitFullScreenOnEnd?: boolean;
  enterFullScreenOnPlay?: boolean;
  exitFullScreenOnPause?: boolean;
  pauseVideoOnFullScreenExit?: boolean;
}

const DEFAULT_CONFIG: IFullScreenConfig = {
  exitFullScreenOnEnd: true,
  enterFullScreenOnPlay: false,
  exitFullScreenOnPause: false,
  pauseVideoOnFullScreenExit: false,
};

export default class FullScreenManager {
  static moduleName = 'fullScreenManager';
  static dependencies = ['eventEmitter', 'engine', 'rootContainer', 'config'];

  private _eventEmitter;
  private _engine;
  private _helper;

  private _exitFullScreenOnEnd: boolean = false;
  private _enterFullScreenOnPlay: boolean = false;
  private _exitFullScreenOnPause: boolean = false;
  private _pauseVideoOnFullScreenExit: boolean = false;

  private _isEnabled: boolean;

  constructor({ eventEmitter, engine, rootContainer, config }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    if (config.fullScreen === false) {
      this._isEnabled = false;
    } else {
      this._isEnabled = true;
      const _config: IFullScreenConfig = {
        ...DEFAULT_CONFIG,
        ...config.fullScreen,
      };

      this._exitFullScreenOnEnd = _config.exitFullScreenOnEnd;
      this._enterFullScreenOnPlay = _config.enterFullScreenOnPlay;
      this._exitFullScreenOnPause = _config.exitFullScreenOnPause;
      this._pauseVideoOnFullScreenExit = _config.pauseVideoOnFullScreenExit;
    }
    this._onChange = this._onChange.bind(this);

    if (isIPhone() || isIPod() || isIPad()) {
      this._helper = new IOSFullScreen(this._engine.getNode(), this._onChange);
    } else {
      this._helper = new DesktopFullScreen(rootContainer.node, this._onChange);
    }

    this._bindEvents();
  }

  _onChange() {
    if (!this._helper.isInFullScreen && this._pauseVideoOnFullScreenExit) {
      this._engine.pause();
    }
    this._eventEmitter.emit(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this._helper.isInFullScreen,
    );
  }

  _bindEvents() {
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._processNextStateFromEngine,
      this,
    );
    this._eventEmitter.on(
      VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED,
      this._enterOnPlayRequested,
      this,
    );
  }

  _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._processNextStateFromEngine,
      this,
    );
    this._eventEmitter.off(
      VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED,
      this._enterOnPlayRequested,
      this,
    );
  }

  _exitOnEnd() {
    if (this._exitFullScreenOnEnd && this.isInFullScreen) {
      this.exitFullScreen();
    }
  }

  _enterOnPlayRequested() {
    if (this._enterFullScreenOnPlay && !this.isInFullScreen) {
      this.enterFullScreen();
    }
  }

  _exitOnPauseRequested() {
    if (this._exitFullScreenOnPause && this.isInFullScreen) {
      this.exitFullScreen();
    }
  }

  _processNextStateFromEngine({ nextState }) {
    switch (nextState) {
      case STATES.ENDED: {
        this._exitOnEnd();
        break;
      }
      case STATES.PAUSED: {
        this._exitOnPauseRequested();
        break;
      }

      /* ignore coverage */
      default:
        break;
    }
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
   * player.isInFullScreen(); // false
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

    delete this._eventEmitter;
    delete this._engine;
  }
}
