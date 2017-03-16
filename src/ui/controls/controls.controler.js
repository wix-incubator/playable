import fullscreen from '../../utils/fullscreen';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
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

const PLAYBACK_CHANGE_TIMEOUT = 300;
const HIDE_CONTROLS_BLOCK_TIMEOUT = 2000;
const SPACE_BAR_KEYCODE = 32;

export default class ControlBlock {
  constructor({ vidi, uiView, eventEmitter, config }) {
    this.eventEmitter = eventEmitter;
    this.vidi = vidi;
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
    this._initUI();
    this._initControls();
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    const config = {
      controlsWrapperView: this.config && this.config.view,
      callbacks: {
        onWrapperMouseMove: this._startHideControlsTimeout,
        onWrapperMouseOut: this._hideContent,
        onWrapperMouseClick: this._processNodeClick,
        onWrapperKeyPress: this._processKeyboardInput,
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
        vidi: this.vidi,
        uiView: this.uiView,
        eventEmitter: this.eventEmitter
      });

      this._controls.push(control);
      this.view.appendControlNode(control.node || control.getNode());
    });
  }

  _bindViewCallbacks() {
    this._processNodeClick = this._processNodeClick.bind(this);
    this._toggleVideoPlayback = this._toggleVideoPlayback.bind(this);
    this._processKeyboardInput = this._processKeyboardInput.bind(this);
    this._startHideControlsTimeout = this._startHideControlsTimeout.bind(this);
    this._setFocusState = this._setFocusState.bind(this);
    this._removeFocusState = this._removeFocusState.bind(this);
    this._showContent = this._showContent.bind(this);
    this._hideContent = this._hideContent.bind(this);
  }

  _bindEvents() {
    this.eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  _processKeyboardInput(e) {
    if (e.keyCode === SPACE_BAR_KEYCODE) {
      this._toggleVideoPlayback();
    }
  }

  _preventClickPropagation(e) {
    e.stopPropagation();
  }

  _processNodeClick() {
    if (this._delayedToggleVideoPlaybackTimeout) {
      clearTimeout(this._delayedToggleVideoPlaybackTimeout);
      this._delayedToggleVideoPlaybackTimeout = null;

      this._toggleFullScreen();
    } else {
      this._delayedToggleVideoPlaybackTimeout = setTimeout(this._toggleVideoPlayback, PLAYBACK_CHANGE_TIMEOUT);
    }
  }

  _toggleVideoPlayback() {
    this._delayedToggleVideoPlaybackTimeout = null;
    const playbackState = this.vidi.getPlaybackState();

    if (playbackState.status === VIDI_PLAYBACK_STATUSES.PLAYING || playbackState.status.PLAYING_BUFFERING) {
      this.vidi.pause();
    } else {
      this.vidi.play();
    }
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

  _toggleFullScreen() {
    if (fullscreen.isFullscreen) {
      this._exitFullScreen();
    } else {
      this._enterFullScreen();
    }
  }

  _enterFullScreen() {
    this.eventEmitter.emit(UI_EVENTS.FULLSCREEN_ENTER_TRIGGERED);

    this.uiView.enterFullScreen();
  }

  _exitFullScreen() {
    this.eventEmitter.emit(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED);

    this.uiView.exitFullScreen();
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
    delete this.vidi;
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
