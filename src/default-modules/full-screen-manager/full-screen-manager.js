import { iPhone, iPod, iPad } from '../../utils/device-detection';
import publicAPI from '../../utils/public-api-decorator';
import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';

import { VIDEO_EVENTS, UI_EVENTS } from '../../constants/index';


const DEFAULT_CONFIG = {
  exitOnEnd: true,
  exitOnPause: false,
  enterOnPlay: false,
  pauseOnExit: false,
  disabled: false
};

export default class FullScreenManager {
  static dependencies = ['eventEmitter', 'engine', 'rootNode', 'config'];

  constructor({ eventEmitter, engine, rootNode, config }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._config = {
      ...DEFAULT_CONFIG,
      ...config.fullScreenManager
    };

    this._onChange = this._onChange.bind(this);

    if (iPhone || iPod || iPad) {
      this._helper = new IOSFullScreen(this._engine.getNode(), this._onChange);
    } else {
      this._helper = new DesktopFullScreen(rootNode, this._onChange);
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
    const { STATES } = this._engine;

    switch (nextState) {
      case STATES.ENDED: {
        this._exitOnEnd();
        break;
      }
      case STATES.PAUSED: {
        this._exitOnPauseRequested();
        break;
      }
      default: break;
    }
  }

  @publicAPI()
  enterFullScreen() {
    if (this._config.disabled) {
      return;
    }

    this._helper.request();
  }

  @publicAPI()
  exitFullScreen() {
    if (!this.isEnabled) {
      return;
    }

    this._helper.exit();
  }

  @publicAPI()
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
