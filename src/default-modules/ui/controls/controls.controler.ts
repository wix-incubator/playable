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
    'playControl',
    'progressControl',
    'timeControl',
    'volumeControl',
    'fullScreenControl',
    'logo',
  ];

  private _eventEmitter;
  private _engine;
  private _screen;
  private _scope;

  private _playControl;
  private _progressControl;
  private _timeControl;
  private _volumeControl;
  private _fullScreenControl;
  private _logo;
  private _hideControlsTimeout;

  private _isContentShowingEnabled: boolean;
  private _isControlsFocused: boolean;
  private _shouldShowContent: boolean;
  private config;

  private _isDragging: boolean;

  view: View;
  isHidden: boolean;

  constructor(
    {
      engine,
      eventEmitter,
      config,
      rootContainer,
      screen,
      playControl,
      progressControl,
      timeControl,
      volumeControl,
      fullScreenControl,
      logo,
    },
    scope,
  ) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._screen = screen;

    this._playControl = playControl;
    this._progressControl = progressControl;
    this._timeControl = timeControl;
    this._volumeControl = volumeControl;
    this._fullScreenControl = fullScreenControl;
    this._logo = logo;

    this.config = {
      ...DEFAULT_CONFIG,
      ...get(config, 'ui.controls'),
    };
    this._scope = scope;
    this.isHidden = false;
    this._isContentShowingEnabled = true;
    this._shouldShowContent = true;
    this._hideControlsTimeout = null;
    this._isControlsFocused = false;

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
    this.view.appendProgressBarNode(this._progressControl.node);
    this.view.appendControlNodeLeft(this._playControl.node);
    this.view.appendControlNodeLeft(this._volumeControl.node);
    this.view.appendControlNodeLeft(this._timeControl.node);
    this.view.appendControlNodeRight(this._fullScreenControl.node);
  }

  _initLogo() {
    const { logo } = this.config;

    if (logo) {
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
    this._eventEmitter.on(
      UI_EVENTS.CONTROL_DRAG_START,
      this._onControlDragStart,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.CONTORL_DRAG_END,
      this._onControlDragEnd,
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
    this._eventEmitter.off(
      UI_EVENTS.CONTROL_DRAG_START,
      this._onControlDragStart,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.CONTORL_DRAG_END,
      this._onControlDragEnd,
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
    this._eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED);
    this._screen.showBottomShadow();

    this.view.showControlsBlock();
  }

  _tryHideContent() {
    if (
      !this._isDragging &&
      !this._shouldShowContent &&
      !this.config.shouldAlwaysShow
    ) {
      this._hideContent();
      this._eventEmitter.emit((UI_EVENTS as any).CONTROL_BLOCK_HIDE_TRIGGERED);
      this._screen.hideBottomShadow();
    }
  }

  _hideContent() {
    this._eventEmitter.emit((UI_EVENTS as any).CONTROL_BLOCK_HIDE_TRIGGERED);
    this._screen.hideBottomShadow();
    this.view.hideControlsBlock();
  }

  _onControlDragStart() {
    this._isDragging = true;
  }

  _onControlDragEnd() {
    this._isDragging = false;
    this._tryHideContent();
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
  setLogoAlwaysShowFlag(isShowAlways) {
    if (isShowAlways) {
      this.view.appendLogoNode(this._logo.node);
    } else {
      this.view.appendControlNodeRight(this._logo.node);
    }
  }

  @playerAPI()
  removeLogo() {
    this._logo.node.parentNode.removeChild(this._logo.node);
  }

  @playerAPI('setControlsShouldAlwaysShow')
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

    delete this._eventEmitter;
    delete this._engine;
    delete this._screen;
    delete this.config;

    this.isHidden = null;
    this._isContentShowingEnabled = null;
    this._shouldShowContent = null;
    this._hideControlsTimeout = null;
    this._isControlsFocused = null;
  }
}
