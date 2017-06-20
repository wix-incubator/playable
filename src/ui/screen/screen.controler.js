import UI_EVENTS from '../../constants/events/ui';

import View from './screen.view';


const PLAYBACK_CHANGE_TIMEOUT = 300;
const SPACE_BAR_KEYCODE = 32;
const LEFT_ARROW_KEYCODE = 37;
const RIGHT_ARROW_KEYCODE = 39;
const UP_ARROW_KEYCODE = 38;
const DOWN_ARROW_KEYCODE = 40;
const AMOUNT_TO_SKIP_SECONDS = 5;
const AMOUNT_TO_CHANGE_VOLUME = 0.1;

const DEFAULT_CONFIG = {
  indicateScreenClick: true,
  nativeControls: false
};

export default class Screen {
  static View = View;

  constructor({ config, eventEmitter, engine, ui }) {
    this._ui = ui;
    this._eventEmitter = eventEmitter;
    this._isInFullScreen = false;
    this.isHidden = false;
    this._engine = engine;
    this._delayedToggleVideoPlaybackTimeout = null;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };

    this._bindCallbacks();
    this._initUI();
    this.view.appendPlaybackViewNode(this._engine.getNode());
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._processNodeClick = this._processNodeClick.bind(this);
    this._processKeyboardInput = this._processKeyboardInput.bind(this);
    this._toggleVideoPlayback = this._toggleVideoPlayback.bind(this);
  }

  _initUI() {
    const config = {
      indicateScreenClick: this.config.indicateScreenClick,
      nativeControls: this.config.nativeControls,
      callbacks: {
        onWrapperKeyPress: this._processKeyboardInput
      }
    };

    if (!this.config.disableClickProcessing) {
      config.callbacks.onWrapperMouseClick = this._processNodeClick;
    }

    this.view = new View(config);
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._setFullScreenStatus, this);
    this._eventEmitter.on(UI_EVENTS.PLAY_OVERLAY_TRIGGERED, this.view.focusOnNode, this.view);
  }

  _unbindEvents() {
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._setFullScreenStatus, this);
    this._eventEmitter.off(UI_EVENTS.PLAY_OVERLAY_TRIGGERED, this.view.focusOnNode, this.view);
  }

  _setFullScreenStatus(isInFullScreen) {
    this._isInFullScreen = isInFullScreen;
  }

  _processKeyboardInput(e) {
    switch (e.keyCode) {
      case SPACE_BAR_KEYCODE:
        this._eventEmitter.emit(UI_EVENTS.ENGINE_CONTROL_THROUGH_KEYBOARD_TRIGGERED);
        this._showPlaybackChangeIndicator();
        this._toggleVideoPlayback();
        break;
      case LEFT_ARROW_KEYCODE:
        this._eventEmitter.emit(UI_EVENTS.ENGINE_CONTROL_THROUGH_KEYBOARD_TRIGGERED);
        this.config.indicateScreenClick && this.view.activateRewindIcon();
        this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
        break;
      case RIGHT_ARROW_KEYCODE:
        this._eventEmitter.emit(UI_EVENTS.ENGINE_CONTROL_THROUGH_KEYBOARD_TRIGGERED);
        this.config.indicateScreenClick && this.view.activateForwardIcon();
        this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
        break;
      case UP_ARROW_KEYCODE:
        this._eventEmitter.emit(UI_EVENTS.ENGINE_CONTROL_THROUGH_KEYBOARD_TRIGGERED);
        this.config.indicateScreenClick && this.view.activateIncreaseVolumeIcon();
        this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
        break;
      case DOWN_ARROW_KEYCODE:
        this._eventEmitter.emit(UI_EVENTS.ENGINE_CONTROL_THROUGH_KEYBOARD_TRIGGERED);
        this.config.indicateScreenClick && this.view.activateDecreaseVolumeIcon();
        this._engine.decreaseVolume(AMOUNT_TO_CHANGE_VOLUME);
        break;
      default: break;
    }
  }

  _processNodeClick() {
    if (this._delayedToggleVideoPlaybackTimeout) {
      clearTimeout(this._delayedToggleVideoPlaybackTimeout);
      this._delayedToggleVideoPlaybackTimeout = null;

      this._hideDelayedPlaybackChangeIndicator();

      this._toggleFullScreen();
    } else {
      this._showPlaybackChangeIndicator();
      this._delayedToggleVideoPlaybackTimeout = setTimeout(this._toggleVideoPlayback, PLAYBACK_CHANGE_TIMEOUT);
    }
  }

  _showPlaybackChangeIndicator() {
    if (this.config.indicateScreenClick) {
      const state = this._engine.getState();

      if (
        state === this._engine.STATES.PLAY_REQUESTED ||
        state === this._engine.STATES.PLAYING
      ) {
        this.view.activatePauseIcon();
      } else {
        this.view.activatePlayIcon();
      }
    }
  }

  _hideDelayedPlaybackChangeIndicator() {
    if (this.config.indicateScreenClick) {
      this.view.deactivateIcon();
    }
  }

  _toggleVideoPlayback() {
    this._delayedToggleVideoPlaybackTimeout = null;

    const state = this._engine.getState();

    if (
      state === this._engine.STATES.PLAY_REQUESTED ||
      state === this._engine.STATES.PLAYING
    ) {
      this._engine.pause();
    } else {
      this._engine.play();
    }
  }

  _toggleFullScreen() {
    if (this._isInFullScreen) {
      this._exitFullScreen();
    } else {
      this._enterFullScreen();
    }
  }

  hide() {
    if (!this.isHidden) {
      this.view.hide();
      this.isHidden = true;
    }
  }

  show() {
    if (this.isHidden) {
      this.view.show();
      this.isHidden = false;
    }
  }

  _enterFullScreen() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED);
  }

  _exitFullScreen() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED);
  }

  destroy() {
    this._unbindEvents();

    clearTimeout(this._delayedToggleVideoPlaybackTimeout);
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this._ui;
  }
}
