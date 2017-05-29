import fullscreen, { isFullscreenAPIExist } from '../../../utils/fullscreen';

import UI_EVENTS from '../../../constants/events/ui';

import View from './full-screen.view';


export default class FullScreenControl {
  static View = View;

  constructor({ view, ui, eventEmitter }) {
    this._ui = ui;
    this._eventEmitter = eventEmitter;
    this._isInFullScreen = null;

    this._bindCallbacks();

    this._initUI(view);

    this._bindEvents();

    this.setControlStatus(false);

    if (!isFullscreenAPIExist) {
      this.hide();
    }
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._updateFullScreenControlStatus = this._updateFullScreenControlStatus.bind(this);
    this._toggleFullScreen = this._toggleFullScreen.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._updateFullScreenControlStatus, this);
  }

  _initUI(view) {
    const config = {
      callbacks: {
        onToggleFullScreenButtonClick: this._toggleFullScreen
      }
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new FullScreenControl.View(config);
    }
  }

  _updateFullScreenControlStatus() {
    this.setControlStatus(fullscreen.isFullscreen);
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

    this._ui.enterFullScreen();
  }

  _exitFullScreen() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED);

    this._ui.exitFullScreen();
  }

  setControlStatus(isFullScreen) {
    this._isInFullScreen = isFullScreen;
    this.view.setFullScreenStatus(this._isInFullScreen);
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
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._updateFullScreenControlStatus, this);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._ui;

    delete this.isHidden;
  }
}
