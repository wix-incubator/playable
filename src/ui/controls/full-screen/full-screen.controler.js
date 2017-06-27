import UI_EVENTS from '../../../constants/events/ui';

import View from './full-screen.view';


export default class FullScreenControl {
  static View = View;
  static dependencies = ['eventEmitter', 'fullScreenManager'];

  constructor({ eventEmitter, fullScreenManager }) {
    this._eventEmitter = eventEmitter;
    this._fullScreenManager = fullScreenManager;

    this._isInFullScreen = null;

    this._bindCallbacks();

    this._initUI();

    this._bindEvents();

    this.setControlStatus(false);

    if (!this._fullScreenManager.isEnabled) {
      this.hide();
    }
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._toggleFullScreen = this._toggleFullScreen.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.setControlStatus, this);
  }

  _initUI() {
    const config = {
      callbacks: {
        onToggleFullScreenButtonClick: this._toggleFullScreen
      }
    };

    this.view = new this.constructor.View(config);
  }

  _toggleFullScreen() {
    if (this._isInFullScreen) {
      this._exitFullScreen();
    } else {
      this._enterFullScreen();
    }
  }

  _enterFullScreen() {
    this._fullScreenManager.enterFullScreen();
  }

  _exitFullScreen() {
    this._fullScreenManager.exitFullScreen();
  }

  setControlStatus(isInFullScreen) {
    this._isInFullScreen = isInFullScreen;
    this.view.setState({ isInFullScreen: this._isInFullScreen });
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  _unbindEvents() {
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.setControlStatus, this);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._fullScreenManager;

    delete this.isHidden;
  }
}
