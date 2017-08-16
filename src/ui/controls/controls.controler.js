import get from 'lodash/get';

import { VIDEO_EVENTS, UI_EVENTS } from '../../constants';

import View from './controls.view';

import ProgressControl from './progress/progress.controler';
import PlayControl from './play/play.controler';
import TimeControl from './time/time.controler';
import VolumeControl from './volume/volume.controler';
import FullscreenControl from './full-screen/full-screen.controler';
import WatchOnSite from './watch-on-site/watch-on-site.controler';
import DependencyContainer from '../../core/dependency-container';


const { asClass } = DependencyContainer;

const DEFAULT_CONFIG = {
  list: [PlayControl, TimeControl, ProgressControl, VolumeControl, FullscreenControl],
  shouldAlwaysShow: false,
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
      ...get(config, 'ui.controls')
    };
    this._scope = scope;
    this.isHidden = false;
    this._shouldShowContent = true;
    this._delayedToggleVideoPlaybackTimeout = null;
    this._hideControlsTimeout = null;
    this._isControlsFocused = false;
    this._controls = [];

    this._bindViewCallbacks();
    this._initUI();
    this._initControls();
    this._initWatchOnSite();
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
    const { list } = this.config;

    list.forEach(Control => {
      const controlName = Control.name;
      this._scope.register(controlName, asClass(Control));
      const control = this._scope.resolve(controlName);
      this._controls.push(control);
      this.view.appendControlNode(control.node || control.getNode());
    });


  }
  _initWatchOnSite() {
    const { watchOnSite } = this.config;

    this._scope.register('watchOnSite', asClass(WatchOnSite));
    this._watchOnSite = this._scope.resolve('watchOnSite');

    if (watchOnSite) {
      this.view.appendComponentNode(this._watchOnSite.node);
      this.setWatchOnSiteAlwaysShowFlag(watchOnSite.showAlways);
    }
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
    this._eventEmitter.on(UI_EVENTS.LOADER_HIDE_TRIGGERED, this._startHideControlsTimeout);
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
    this._eventEmitter.emit(UI_EVENTS.SHOW_BOTTOM_SHADOW_TRIGGERED);

    this.view.showControlsBlock();

    if (this._watchOnSite.isHidden) {
      this._watchOnSite.show();
    }
  }

  _hideContent() {
    if (!this._shouldShowContent && !this.config.shouldAlwaysShow) {
      this._eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED);
      this._eventEmitter.emit(UI_EVENTS.HIDE_BOTTOM_SHADOW_TRIGGERED);

      this.view.hideControlsBlock();

      if (!this.shouldWatchOnSiteAlwaysShow) {
        this._watchOnSite.hide();
      }
    }
  }

  _updatePlayingStatus({ nextState }) {
    const { STATES } = this._engine;

    switch (nextState) {
      case STATES.PLAY_REQUESTED: {
        this._shouldShowContent = false;
        this._startHideControlsTimeout();
        break;
      }
      case STATES.ENDED: {
        this._shouldShowContent = true;
        this._showContent();
        break;
      }
      case STATES.PAUSED: {
        this._shouldShowContent = true;
        this._showContent();
        break;
      }
      case STATES.SRC_SET: {
        this._shouldShowContent = true;
        this._showContent();
        break;
      }
      default: break;
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
    this._eventEmitter.off(UI_EVENTS.LOADER_HIDE_TRIGGERED, this._startHideControlsTimeout);
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus, this);
  }

  setWatchOnSiteLogo(logo) {
    this._watchOnSite.setLogo(logo);
  }

  setWatchOnSiteAlwaysShowFlag(isShowAlways) {
    this.shouldWatchOnSiteAlwaysShow = isShowAlways;

    if (this.shouldWatchOnSiteAlwaysShow && this._watchOnSite.isHidden) {
      this._watchOnSite.show();
    } else {
      this._watchOnSite.hide();
    }
  }

  removeWatchOnSite() {
    this._watchOnSite.node.parentNode.removeChild(this._watchOnSite.node);
  }

  setShouldAlwaysShow(flag) {
    this.config.shouldAlwaysShow = flag;

    if (this.config.shouldAlwaysShow) {
      this._showContent();
    } else {
      this._startHideControlsTimeout();
    }
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
    delete this.config;

    this.isHidden = null;
    this._shouldShowContent = null;
    this._hideControlsTimeout = null;
    this._isControlsFocused = null;
    this._delayedToggleVideoPlaybackTimeout = null;
  }
}
