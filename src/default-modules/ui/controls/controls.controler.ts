import * as get from 'lodash/get';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../constants/index';

import playerAPI from '../../../utils/player-api-decorator';

import View from './controls.view';

import ProgressControl from './progress/progress.controler';
import PlayControl from './play/play.controler';
import TimeControl from './time/time.controler';
import VolumeControl from './volume/volume.controler';
import FullScreenControl from './full-screen/full-screen.controler';
import Logo from './logo/logo';
import DependencyContainer from '../../../core/dependency-container/index';

const { asClass } = DependencyContainer;

const DEFAULT_CONFIG = {
  list: [
    PlayControl,
    TimeControl,
    ProgressControl,
    VolumeControl,
    FullScreenControl,
  ],
  shouldAlwaysShow: false,
  view: null,
};

const HIDE_CONTROLS_BLOCK_TIMEOUT = 2000;

export default class ControlBlock {
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'config',
    'rootContainer',
    'screen',
  ];

  private _eventEmitter;
  private _engine;
  private _screen;
  private _scope;

  private _controls;
  private _logo;
  private _delayedToggleVideoPlaybackTimeout;
  private _hideControlsTimeout;

  private _isContentShowingEnabled: boolean;
  private _isControlsFocused: boolean;
  private _shouldShowContent: boolean;
  private _controlContentHidden: boolean;
  private shouldLogoAlwaysShow: boolean;
  private config;

  view: View;
  isHidden: boolean;

  constructor({ engine, eventEmitter, config, rootContainer, screen }, scope) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._screen = screen;
    this.config = {
      ...DEFAULT_CONFIG,
      ...get(config, 'ui.controls'),
    };
    this._scope = scope;
    this.isHidden = false;
    this._isContentShowingEnabled = true;
    this._shouldShowContent = true;
    this._delayedToggleVideoPlaybackTimeout = null;
    this._hideControlsTimeout = null;
    this._isControlsFocused = false;
    this._controls = [];

    this._bindViewCallbacks();
    this._initUI();
    this._initControls();
    this._initLogo();
    this._bindEvents();
    if (get(config, 'ui.controls') !== false) {
      rootContainer.appendComponentNode(this.node);
    }
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    const { view } = this.config;
    const config = {
      callbacks: {
        onControlsBlockMouseMove: this._setFocusState,
        onControlsBlockMouseOut: this._removeFocusState,
      },
    };
    if (view) {
      this.view = new view(config);
    } else {
      this.view = new ControlBlock.View(config);
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

  _initLogo() {
    const { logo } = this.config;

    this._scope.register('logo', asClass(Logo));
    this._logo = this._scope.resolve('logo');

    if (logo) {
      this.view.appendComponentNode(this._logo.node);
      this.setLogoAlwaysShowFlag(logo.showAlways);
    }
  }

  _bindViewCallbacks() {
    this._startHideControlsTimeout = this._startHideControlsTimeout.bind(this);
    this._setFocusState = this._setFocusState.bind(this);
    this._removeFocusState = this._removeFocusState.bind(this);
    this._tryShowContent = this._tryShowContent.bind(this);
    this._tryHideContent = this._tryHideContent.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(
      UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED,
      this._startHideControlsTimeout,
    );
    this._eventEmitter.on(
      UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED,
      this._tryHideContent,
    );
    this._eventEmitter.on(
      UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED,
      this._startHideControlsTimeout,
    );
    this._eventEmitter.on(
      UI_EVENTS.LOADER_HIDE_TRIGGERED,
      this._startHideControlsTimeout,
    );
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._updatePlayingStatus,
      this,
    );
  }

  _unbindEvents() {
    this._eventEmitter.off(
      UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED,
      this._startHideControlsTimeout,
    );
    this._eventEmitter.off(
      UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED,
      this._tryHideContent,
    );
    this._eventEmitter.off(
      UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED,
      this._startHideControlsTimeout,
    );
    this._eventEmitter.off(
      UI_EVENTS.LOADER_HIDE_TRIGGERED,
      this._startHideControlsTimeout,
    );
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._updatePlayingStatus,
      this,
    );
  }

  _startHideControlsTimeout() {
    this._stopHideControlsTimeout();

    this._tryShowContent();

    if (!this._isControlsFocused) {
      this._hideControlsTimeout = setTimeout(
        this._tryHideContent,
        HIDE_CONTROLS_BLOCK_TIMEOUT,
      );
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

  _tryShowContent() {
    if (this._isContentShowingEnabled) {
      this._showContent();
    }
  }

  _showContent() {
    if (!this._isContentShowingEnabled) {
      return;
    }

    this._eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED);
    this._screen.showBottomShadow();
    // TODO: check `UI_EVENTS.SHOW_BOTTOM_SHADOW_TRIGGERED` event
    this._eventEmitter.emit((UI_EVENTS as any).SHOW_BOTTOM_SHADOW_TRIGGERED);

    this.view.showControlsBlock();
    this._controlContentHidden = false;

    this._logo.show();
  }

  _tryHideContent() {
    if (!this._shouldShowContent && !this.config.shouldAlwaysShow) {
      this._hideContent();
    }
  }

  _hideContent() {
    this._eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED);
    this._screen.hideBottomShadow();

    this.view.hideControlsBlock();
    this._controlContentHidden = true;
    if (!this.shouldLogoAlwaysShow) {
      this._logo.hide();
    }
  }

  _updatePlayingStatus({ nextState }) {
    switch (nextState) {
      case STATES.PLAY_REQUESTED: {
        this._shouldShowContent = false;
        this._startHideControlsTimeout();
        break;
      }
      case STATES.ENDED: {
        this._shouldShowContent = true;
        this._tryShowContent();
        break;
      }
      case STATES.PAUSED: {
        this._shouldShowContent = true;
        this._tryShowContent();
        break;
      }
      case STATES.SRC_SET: {
        this._shouldShowContent = true;
        this._tryShowContent();
        break;
      }
      default:
        break;
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

  disableShowingContent() {
    this._isContentShowingEnabled = false;
    this._hideContent();
  }

  enableShowingContent() {
    this._isContentShowingEnabled = true;
    if (this._shouldShowContent) {
      this._showContent();
    }
  }

  @playerAPI()
  setLogo(logo) {
    this._logo.setLogo(logo);
  }

  @playerAPI()
  setLogoAlwaysShowFlag(isShowAlways) {
    this.shouldLogoAlwaysShow = isShowAlways;

    if (this.shouldLogoAlwaysShow) {
      this._logo.show();
    } else if (this._controlContentHidden) {
      this._logo.hide();
    }
  }

  @playerAPI()
  setLogoClickCallback(callback) {
    this._logo.setLogoClickCallback(callback);
  }

  @playerAPI()
  removeLogo() {
    this._logo.node.parentNode.removeChild(this._logo.node);
  }

  @playerAPI()
  setShouldAlwaysShow(flag) {
    this.config.shouldAlwaysShow = flag;

    if (this.config.shouldAlwaysShow) {
      this._tryShowContent();
    } else {
      this._startHideControlsTimeout();
    }
  }

  destroy() {
    this._stopHideControlsTimeout();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    this._controls.forEach(control => control.destroy());
    delete this._controls;

    this._logo.destroy();
    delete this._logo;

    delete this._eventEmitter;
    delete this._engine;
    delete this._screen;
    delete this.config;

    this.isHidden = null;
    this._isContentShowingEnabled = null;
    this._shouldShowContent = null;
    this._hideControlsTimeout = null;
    this._isControlsFocused = null;
    this._delayedToggleVideoPlaybackTimeout = null;
  }
}
