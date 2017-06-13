import UI_EVENTS from '../../../constants/events/ui';

import View from './full-screen.view';


export default class FullScreenControl {
  static View = View;

  constructor({ eventEmitter }) {
    this._eventEmitter = eventEmitter;
    this._isInFullScreen = null;

    this._bindCallbacks();

    this._initUI();

    this._bindEvents();

    this.setControlStatus(false);
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
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED);
  }

  _exitFullScreen() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED);
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

    delete this.isHidden;
  }
}
