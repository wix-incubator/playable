import VIDEO_EVENTS from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import View from './controls.view';

import ProgressControl from './progress/progress.controler';
import PlayControl from './play/play.controler';
import TimeControl from './time/time.controler';
import VolumeControl from './volume/volume.controler';
import FullscreenControl from './full-screen/full-screen.controler';


const DEFAULT_CONFIG = {
  list: [PlayControl, TimeControl, ProgressControl, VolumeControl, FullscreenControl],
  view: null
};

const HIDE_CONTROLS_BLOCK_TIMEOUT = 2000;

export default class ControlBlock {
  static View = View;

  constructor({ engine, ui, eventEmitter, config }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._ui = ui;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };

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
        onControlsBlockMouseClick: this._preventClickPropagation,
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
      const control = new Control({
        engine: this._engine,
        eventEmitter: this._eventEmitter
      });

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

    this._eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  _preventClickPropagation(e) {
    e.stopPropagation();
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
    this.view.showControlsBlock();
  }

  _hideContent() {
    if (!this._isVideoPaused) {
      this.view.hideControlsBlock();
    }
  }

  _updatePlayingStatus(status) {
    if (status === this._engine.STATUSES.PLAY_REQUESTED) {
      this._isVideoPaused = false;
      this._startHideControlsTimeout();
    } else if (status === this._engine.STATUSES.ENDED) {
      this._isVideoPaused = false;
      this._hideContent();
    } else if (status === this._engine.STATUSES.PAUSED) {
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

    this._eventEmitter.off(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
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
