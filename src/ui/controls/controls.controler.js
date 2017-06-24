import VIDEO_EVENTS from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import View from './controls.view';

import ProgressControl from './progress/progress.controler';
import PlayControl from './play/play.controler';
import TimeControl from './time/time.controler';
import VolumeControl from './volume/volume.controler';
import FullscreenControl from './full-screen/full-screen.controler';
import DependencyContainer from '../../core/dependency-container';


const { asClass } = DependencyContainer;

const DEFAULT_CONFIG = {
  list: [PlayControl, TimeControl, ProgressControl, VolumeControl, FullscreenControl],
  view: null
};

const HIDE_CONTROLS_BLOCK_TIMEOUT = 2000;

export default class ControlBlock {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config'];

  constructor({ engine, eventEmitter, config }, scope) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config.ui.controls
    };
    this._scope = scope;
    this.isHidden = false;
    this._isVideoPaused = false;
    this._delayedToggleVideoPlaybackTimeout = null;
    this._hideControlsTimeout = null;
    this._isControlsFocused = false;
    this._controls = [];

    this._bindViewCallbacks();
    this._initUI();
    this._initControls();
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    const { view } = this.config;
    const config = {
      callbacks: {
        onControlsBlockMouseMove: this._setFocusState,
        onControlsBlockMouseOut: this._removeFocusState
      }
    };
    if (view) {
      this.view = new view(config);
    } else {
      this.view = new this.constructor.View(config);
    }
  }

  _initControls() {
    this.config.list.forEach(Control => {
      const controlName = Control.name;
      this._scope.register(controlName, asClass(Control));
      const control = this._scope.resolve(controlName);
      this._controls.push(control);
      this.view.appendControlNode(control.node || control.getNode());
    });
  }

  _bindViewCallbacks() {
    this._startHideControlsTimeout = this._startHideControlsTimeout.bind(this);
    this._setFocusState = this._setFocusState.bind(this);
    this._removeFocusState = this._removeFocusState.bind(this);
    this._showContent = this._showContent.bind(this);
    this._hideContent = this._hideContent.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED, this._startHideControlsTimeout);
    this._eventEmitter.on(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED, this._hideContent);
    this._eventEmitter.on(UI_EVENTS.ENGINE_CONTROL_THROUGH_KEYBOARD_TRIGGERED, this._startHideControlsTimeout);

    this._eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus, this);
  }

  _startHideControlsTimeout() {
    this._stopHideControlsTimeout();

    this._showContent();

    if (!this._isControlsFocused) {
      this._hideControlsTimeout = setTimeout(this._hideContent, HIDE_CONTROLS_BLOCK_TIMEOUT);
    }
  }

  _stopHideControlsTimeout() {
    if (this._hideControlsTimeout) {
      clearTimeout(this._hideControlsTimeout);
    }
  }

  _setFocusState() {
    this._isControlsFocused = true;
  }

  _removeFocusState() {
    this._isControlsFocused = false;
  }

  _showContent() {
    this._eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED);

    this.view.showControlsBlock();
  }

  _hideContent() {
    if (!this._isVideoPaused) {
      this._eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED);

      this.view.hideControlsBlock();
    }
  }

  _updatePlayingStatus({ nextState }) {
    if (nextState === this._engine.STATES.PLAY_REQUESTED) {
      this._isVideoPaused = false;
      this._startHideControlsTimeout();
    } else if (nextState === this._engine.STATES.ENDED) {
      this._isVideoPaused = false;
      this._hideContent();
    } else if (nextState === this._engine.STATES.PAUSED) {
      this._isVideoPaused = true;
      this._showContent();
    }
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
    this._eventEmitter.off(UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED, this._startHideControlsTimeout);
    this._eventEmitter.off(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED, this._hideContent);
    this._eventEmitter.off(UI_EVENTS.ENGINE_CONTROL_THROUGH_KEYBOARD_TRIGGERED, this._startHideControlsTimeout);

    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus, this);
  }

  destroy() {
    this._stopHideControlsTimeout();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    this._controls.forEach(control => (control.destroy()));
    delete this._controls;

    delete this._eventEmitter;
    delete this._engine;
    delete this._ui;
    delete this.config;

    this.isHidden = null;
    this._isVideoPaused = null;
    this._hideControlsTimeout = null;
    this._isControlsFocused = null;
    this._delayedToggleVideoPlaybackTimeout = null;
  }
}
