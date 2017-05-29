import { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import View from './screen.view';


const PLAYBACK_CHANGE_TIMEOUT = 300;
const SPACE_BAR_KEYCODE = 32;

export default class Screen {
  static View = View;

  constructor({ config, eventEmitter, engine, ui }) {
    this._ui = ui;
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;
    this._delayedToggleVideoPlaybackTimeout = null;
    this.config = {
      ...config
    };

    this._bindCallbacks();
    this._initUI();
    this.view.appendPlaybackViewNode(this._engine.getNode());
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

      this._hideDelayedPlaybackChangeIndicator();

      this._toggleFullScreen();
    } else {
      this._showDelayedPlaybackChangeIndicator();
      this._delayedToggleVideoPlaybackTimeout = setTimeout(this._toggleVideoPlayback, PLAYBACK_CHANGE_TIMEOUT);
    }
  }

  _showDelayedPlaybackChangeIndicator() {
    if (this.config.indicateScreenClick) {
      const playbackState = this._engine.getPlaybackState();

      if (playbackState.status === VIDI_PLAYBACK_STATUSES.PLAYING || playbackState.status.PLAYING_BUFFERING) {
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
    const playbackState = this._engine.getPlaybackState();

    if (playbackState.status === VIDI_PLAYBACK_STATUSES.PLAYING || playbackState.status.PLAYING_BUFFERING) {
      this._engine.pause();
    } else {
      this._engine.play();
    }
  }

  _toggleFullScreen() {
    if (this._ui.isInFullScreen) {
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

    this._ui.enterFullScreen();
  }

  _exitFullScreen() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_EXIT_TRIGGERED);

    this._ui.exitFullScreen();
  }

  destroy() {
    clearTimeout(this._delayedToggleVideoPlaybackTimeout);
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this._ui;
  }
}
