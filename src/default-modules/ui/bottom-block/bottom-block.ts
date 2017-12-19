import * as get from 'lodash/get';
import * as isEmpty from 'lodash/isEmpty';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../constants/index';

import playerAPI from '../../../utils/player-api-decorator';

import View from './bottom-block.view';

import ProgressControl from '../controls/progress/progress.controler';
import PlayControl from '../controls/play/play.controler';
import TimeControl from '../controls/time/time.controler';
import VolumeControl from '../controls/volume/volume.controler';
import FullScreenControl from '../controls/full-screen/full-screen.controler';
import Logo from '../controls/logo/logo';

const DEFAULT_CONFIG = {
  shouldAlwaysShow: false,
};

const HIDE_BLOCK_TIMEOUT = 2000;

export default class BottomBlock {
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

  private _hideTimeout;

  private _isContentShowingEnabled: boolean;
  private _isBlockFocused: boolean;
  private _shouldShowContent: boolean;
  private config;

  private _isDragging: boolean;

  view: View;
  isHidden: boolean;

  constructor(dependencies) {
    const {
      config,
      rootContainer,
      eventEmitter,
      engine,
      screen,
    } = dependencies;
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._screen = screen;

    this.config = {
      ...DEFAULT_CONFIG,
      ...get(config, 'ui.controls'),
    };
    this.isHidden = false;
    this._isContentShowingEnabled = true;
    this._shouldShowContent = true;
    this._hideTimeout = null;
    this._isBlockFocused = false;

    this._bindViewCallbacks();
    this._initUI(this._getElementNodes(dependencies));
    this._initLogo();
    this._bindEvents();

    rootContainer.appendComponentNode(this.node);

    if (get(config, 'ui.controls') === false) {
      this.hide();
    }
  }

  private _getElementNodes(dependencies) {
    const {
      playControl,
      progressControl,
      timeControl,
      volumeControl,
      fullScreenControl,
      logo,
    } = dependencies;

    return {
      play: playControl.node,
      progress: progressControl.node,
      time: timeControl.node,
      volume: volumeControl.node,
      fullScreen: fullScreenControl.node,
      logo: logo.node,
    };
  }

  get node() {
    return this.view.getNode();
  }

  private _initUI(elementNodes) {
    const { view } = this.config;
    const config = {
      elements: elementNodes,
      callbacks: {
        onBlockMouseMove: this._setFocusState,
        onBlockMouseOut: this._removeFocusState,
      },
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new BottomBlock.View(config);
    }
  }

  private _initLogo() {
    const { logo } = this.config;

    if (!isEmpty(logo)) {
      this.setLogoAlwaysShowFlag(logo.showAlways);
    } else {
      this.removeLogo();
    }
  }

  private _bindViewCallbacks() {
    this._startHideBlockTimeout = this._startHideBlockTimeout.bind(this);
    this._setFocusState = this._setFocusState.bind(this);
    this._removeFocusState = this._removeFocusState.bind(this);
    this._tryShowContent = this._tryShowContent.bind(this);
    this._tryHideContent = this._tryHideContent.bind(this);
  }

  private _bindEvents() {
    this._eventEmitter.on(
      UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED,
      this._startHideBlockTimeout,
    );
    this._eventEmitter.on(
      UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED,
      this._tryHideContent,
    );
    this._eventEmitter.on(
      UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED,
      this._startHideBlockTimeout,
    );
    this._eventEmitter.on(
      UI_EVENTS.LOADER_HIDE_TRIGGERED,
      this._startHideBlockTimeout,
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
      UI_EVENTS.CONTROL_DRAG_END,
      this._onControlDragEnd,
      this,
    );
  }

  private _unbindEvents() {
    this._eventEmitter.off(
      UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED,
      this._startHideBlockTimeout,
    );
    this._eventEmitter.off(
      UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED,
      this._tryHideContent,
    );
    this._eventEmitter.off(
      UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED,
      this._startHideBlockTimeout,
    );
    this._eventEmitter.off(
      UI_EVENTS.LOADER_HIDE_TRIGGERED,
      this._startHideBlockTimeout,
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
      UI_EVENTS.CONTROL_DRAG_END,
      this._onControlDragEnd,
      this,
    );
  }

  private _startHideBlockTimeout() {
    this._stopHideBlockTimeout();

    this._tryShowContent();

    if (!this._isBlockFocused) {
      this._hideTimeout = setTimeout(this._tryHideContent, HIDE_BLOCK_TIMEOUT);
    }
  }

  private _stopHideBlockTimeout() {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
  }

  private _setFocusState() {
    this._isBlockFocused = true;
  }

  private _removeFocusState() {
    this._isBlockFocused = false;
  }

  private _tryShowContent() {
    if (this._isContentShowingEnabled) {
      this._showContent();
    }
  }

  private _showContent() {
    this._eventEmitter.emit(UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED);
    this._screen.showBottomShadow();

    this.view.showContent();
  }

  private _tryHideContent() {
    if (
      !this._isDragging &&
      !this._shouldShowContent &&
      !this.config.shouldAlwaysShow
    ) {
      this._hideContent();
    }
  }

  private _hideContent() {
    this._eventEmitter.emit((UI_EVENTS as any).CONTROL_BLOCK_HIDE_TRIGGERED);
    this._screen.hideBottomShadow();
    this.view.hideContent();
  }

  private _onControlDragStart() {
    this._isDragging = true;
  }

  private _onControlDragEnd() {
    this._isDragging = false;
    this._tryHideContent();
  }

  _updatePlayingStatus({ nextState }) {
    switch (nextState) {
      case STATES.PLAY_REQUESTED: {
        this._shouldShowContent = false;
        this._startHideBlockTimeout();
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
    this.view.setShouldLogoShowAlwaysFlag(isShowAlways);
  }

  @playerAPI()
  removeLogo() {
    this.view.hideLogo();
  }

  @playerAPI('setControlsShouldAlwaysShow')
  setShouldAlwaysShow(flag) {
    this.config.shouldAlwaysShow = flag;

    if (this.config.shouldAlwaysShow) {
      this._tryShowContent();
    } else {
      this._startHideBlockTimeout();
    }
  }

  destroy() {
    this._stopHideBlockTimeout();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this._screen;
    delete this.config;
  }
}
