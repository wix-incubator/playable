import { iPhone, iPod, iPad } from '../utils/device-detection';
import DesktopFullScreen from './desktop';
import IOSFullScreen from './ios';

import UI_EVENTS from '../constants/events/ui';
import VIDEO_EVENTS from '../constants/events/video';


const DEFAULT_CONFIG = {
  exitOnEnd: true
};

export default class FullScreenManager {
  static dependencies = ['eventEmitter', 'engine', 'ui', 'config'];

  constructor({ eventEmitter, engine, ui, config }) {
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
      this._helper = new DesktopFullScreen(ui.view.getNode(), this._onChange);
    }

    this._bindCallbacks();
    this._bindEvents();
  }

  _onChange() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._helper.isInFullScreen);
  }

  _bindCallbacks() {
    this._exitOnEndState = this._exitOnEndState.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this._exitOnEndState, this);
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED, this.enterFullScreen, this);
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED, this.exitFullScreen, this);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._exitOnEndState, this);
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED, this.enterFullScreen, this);
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED, this.exitFullScreen, this);
  }

  _exitOnEndState({ nextState }) {
    if (!this._config.exitOnEnd) {
      return;
    }
    if (nextState === this._engine.STATES.ENDED && this.isInFullScreen) {
      this.exitFullScreen();
    }
  }

  enterFullScreen() {
    this._helper.request();
  }

  exitFullScreen() {
    this._helper.exit();
  }

  get isInFullScreen() {
    return this._helper.isInFullScreen;
  }

  destroy() {
    this._unbindEvents();

    this._helper.destroy();

    delete this._eventEmitter;
    delete this._engine;
  }
}
