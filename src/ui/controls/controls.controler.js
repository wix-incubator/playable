import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';

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
  constructor({ engine, uiView, eventEmitter, config }) {
    this.eventEmitter = eventEmitter;
    this._engine = engine;
    this.uiView = uiView;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };

    this.isHidden = false;
    this._isVideoPaused = false;
    this._delayedToggleVideoPlaybackTimeout = null;
    this._hideControlsTimeout = null;
    this._updateControlsInterval = null;
    this._isControlsFocused = false;
    this._controls = [];

    this._bindViewCallbacks();
    this._initUI(uiView);
    this._initControls();
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  _initUI(uiView) {
    const config = {
      uiView,
      controlsWrapperView: this.config && this.config.view,
      callbacks: {
        onWrapperMouseMove: this._startHideControlsTimeout,
        onWrapperMouseOut: this._hideContent,
        onControlsBlockMouseClick: this._preventClickPropagation,
        onControlsBlockMouseMove: this._setFocusState,
        onControlsBlockMouseOut: this._removeFocusState
      }
    };

    this.view = new View(config);
  }

  _initControls() {
    this.config.list.forEach(Control => {
      const control = new Control({
        engine: this._engine,
        uiView: this.uiView,
        eventEmitter: this.eventEmitter
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
    this.eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  _preventClickPropagation(e) {
    e.stopPropagation();
  }

  _startHideControlsTimeout() {
    if (this._hideControlsTimeout) {
      clearTimeout(this._hideControlsTimeout);
    }

    this._showContent();

    if (!this._isControlsFocused) {
      this._hideControlsTimeout = setTimeout(this._hideContent, HIDE_CONTROLS_BLOCK_TIMEOUT);
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
    if (status === VIDI_PLAYBACK_STATUSES.PLAYING || status === VIDI_PLAYBACK_STATUSES.PLAYING_BUFFERING) {
      this._isVideoPaused = false;
      this._startHideControlsTimeout();
    } else if (status === VIDI_PLAYBACK_STATUSES.ENDED) {
      this._isVideoPaused = false;
      this._hideContent();
    } else {
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
    this.eventEmitter.off(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    this._controls.forEach(control => (control.destroy()));
    delete this._controls;

    delete this.eventEmitter;
    delete this._engine;
    delete this.uiView;
    delete this.config;

    this.isHidden = null;
    this._isVideoPaused = null;
    this._hideControlsTimeout = null;
    this._updateControlsInterval = null;
    this._isControlsFocused = null;
    this._delayedToggleVideoPlaybackTimeout = null;
  }
}
