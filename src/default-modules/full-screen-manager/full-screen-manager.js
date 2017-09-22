import { isIPhone, isIPod, isIPad } from '../../utils/device-detection';
import playerAPI from '../../utils/player-api-decorator';
import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../constants/index';


const DEFAULT_CONFIG = {
  exitOnEnd: true,
  exitOnPause: false,
  enterOnPlay: false,
  pauseOnExit: false,
  disabled: false
};

export default class FullScreenManager {
  static dependencies = ['eventEmitter', 'engine', 'rootContainer', 'config'];

  constructor({ eventEmitter, engine, rootContainer, config }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._config = {
      ...DEFAULT_CONFIG,
      ...config.fullScreenManager
    };

    this._onChange = this._onChange.bind(this);

    if (isIPhone() || isIPod() || isIPad()) {
      this._helper = new IOSFullScreen(this._engine.getNode(), this._onChange);
    } else {
      this._helper = new DesktopFullScreen(rootContainer.node, this._onChange);
    }

    this._bindEvents();
  }

  _onChange() {
    if (!this._helper.isInFullScreen && this._config.pauseOnExit) {
      this._engine.pause();
    }
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._helper.isInFullScreen);
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this._processNextStateFromEngine, this);
    this._eventEmitter.on(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED, this._enterOnPlayRequested, this);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._processNextStateFromEngine, this);
    this._eventEmitter.off(VIDEO_EVENTS.PLAY_REQUEST_TRIGGERED, this._enterOnPlayRequested, this);
  }

  _exitOnEnd() {
    if (this._config.exitOnEnd && this.isInFullScreen) {
      this.exitFullScreen();
    }
  }

  _enterOnPlayRequested() {
    if (this._config.enterOnPlay && !this.isInFullScreen) {
      this.enterFullScreen();
    }
  }

  _exitOnPauseRequested() {
    if (this._config.exitOnPause && this.isInFullScreen) {
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
      default: break;
    }
  }

  @playerAPI()
  enterFullScreen() {
    if (!this.isEnabled) {
      return;
    }

    this._helper.request();
  }

  @playerAPI()
  exitFullScreen() {
    if (!this.isEnabled) {
      return;
    }

    this._helper.exit();
  }

  @playerAPI()
  get isInFullScreen() {
    if (!this.isEnabled) {
      return false;
    }

    return this._helper.isInFullScreen;
  }

  get isEnabled() {
    return this._helper.isEnabled && !this._config.disabled;
  }

  destroy() {
    this._unbindEvents();

    this._helper.destroy();

    delete this._eventEmitter;
    delete this._engine;
  }
}
