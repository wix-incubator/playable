import get from 'lodash/get';

import { UI_EVENTS } from '../../../constants/index';

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
  static dependencies = ['engine', 'eventEmitter', 'config', 'fullScreenManager'];

  constructor({ config, eventEmitter, engine, fullScreenManager }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._fullScreenManager = fullScreenManager;

    this._isInFullScreen = false;
    this.isHidden = false;

    this._delayedToggleVideoPlaybackTimeout = null;
    this.config = {
      ...DEFAULT_CONFIG,
      ...get(config, 'ui.screen')
    };

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._processNodeClick = this._processNodeClick.bind(this);
    this._processNodeDblClick = this._processNodeDblClick.bind(this);
    this._processKeyboardInput = this._processKeyboardInput.bind(this);
    this._toggleVideoPlayback = this._toggleVideoPlayback.bind(this);
  }

  _initUI() {
    const config = {
      indicateScreenClick: this.config.indicateScreenClick,
      nativeControls: this.config.nativeControls,
      callbacks: {
        onWrapperKeyPress: this._processKeyboardInput
      },
      playbackViewNode: this._engine.getNode()
    };

    if (!this.config.disableClickProcessing) {
      config.callbacks.onWrapperMouseClick = this._processNodeClick;
      config.callbacks.onWrapperMouseDblClick = this._processNodeDblClick;
    }

    this.view = new View(config);
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._setFullScreenStatus, this);
    this._eventEmitter.on(UI_EVENTS.PLAY_OVERLAY_TRIGGERED, this.view.focusOnNode, this.view);
    this._eventEmitter.on(UI_EVENTS.SHOW_TOP_SHADOW_TRIGGERED, this.view.showTopShadow, this.view);
    this._eventEmitter.on(UI_EVENTS.SHOW_BOTTOM_SHADOW_TRIGGERED, this.view.showBottomShadow, this.view);
    this._eventEmitter.on(UI_EVENTS.HIDE_TOP_SHADOW_TRIGGERED, this.view.hideTopShadow, this.view);
    this._eventEmitter.on(UI_EVENTS.HIDE_BOTTOM_SHADOW_TRIGGERED, this.view.hideBottomShadow, this.view);
  }

  _unbindEvents() {
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._setFullScreenStatus, this);
    this._eventEmitter.off(UI_EVENTS.PLAY_OVERLAY_TRIGGERED, this.view.focusOnNode, this.view);
    this._eventEmitter.off(UI_EVENTS.SHOW_TOP_SHADOW_TRIGGERED, this.view.showTopShadow, this.view);
    this._eventEmitter.off(UI_EVENTS.SHOW_BOTTOM_SHADOW_TRIGGERED, this.view.showBottomShadow, this.view);
    this._eventEmitter.off(UI_EVENTS.HIDE_TOP_SHADOW_TRIGGERED, this.view.hideTopShadow, this.view);
    this._eventEmitter.off(UI_EVENTS.HIDE_BOTTOM_SHADOW_TRIGGERED, this.view.hideBottomShadow, this.view);
  }

  _setFullScreenStatus(isInFullScreen) {
    this._isInFullScreen = isInFullScreen;
  }

  _processKeyboardInput(e) {
    e.stopPropagation();
    e.preventDefault();
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
    if (!this._fullScreenManager.isEnabled || this._fullScreenManager._config.enterOnPlay) {
      this._showPlaybackChangeIndicator();
      this._toggleVideoPlayback();
      return;
    }

    if (this._isDelayedPlaybackToggleExist) {
      this._clearDelayedPlaybackToggle();
      this._hideDelayedPlaybackChangeIndicator();
    } else {
      this._showPlaybackChangeIndicator();
      this._setDelayedPlaybackToggle();
    }
  }

  _processNodeDblClick() {
    this._toggleFullScreen();
  }

  _showPlaybackChangeIndicator() {
    if (this.config.indicateScreenClick) {
      const state = this._engine.getCurrentState();

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

  _setDelayedPlaybackToggle() {
    this._clearDelayedPlaybackToggle();

    this._delayedToggleVideoPlaybackTimeout = setTimeout(this._toggleVideoPlayback, PLAYBACK_CHANGE_TIMEOUT);
  }

  _clearDelayedPlaybackToggle() {
    clearTimeout(this._delayedToggleVideoPlaybackTimeout);
    this._delayedToggleVideoPlaybackTimeout = null;
  }

  get _isDelayedPlaybackToggleExist() {
    return Boolean(this._delayedToggleVideoPlaybackTimeout);
  }

  _toggleVideoPlayback() {
    this._clearDelayedPlaybackToggle();

    const state = this._engine.getCurrentState();

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
    this._fullScreenManager.enterFullScreen();
  }

  _exitFullScreen() {
    this._fullScreenManager.exitFullScreen();
  }

  destroy() {
    this._unbindEvents();

    this._clearDelayedPlaybackToggle();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this._fullScreenManager;
  }
}
