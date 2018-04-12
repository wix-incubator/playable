import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../constants/index';
import playerAPI from '../../../utils/player-api-decorator';

import MainUIBlockView from './main-ui-block.view';

const HIDE_BLOCK_TIMEOUT = 2000;

export interface IControlsConfig {
  shouldAlwaysShow?: boolean;
}

const DEFAULT_CONFIG: IControlsConfig = {
  shouldAlwaysShow: false,
};

export default class MainUIBlock {
  static moduleName = 'mainUIBlock';
  static View = MainUIBlockView;
  static dependencies = [
    'config',
    'screen',
    'rootContainer',
    'tooltipService',
    'eventEmitter',
    'topBlock',
    'bottomBlock',
  ];

  private _eventEmitter;
  private _bottomBlock;
  private _topBlock;
  private _screen;

  private _hideTimeout = null;

  private _isContentShowingEnabled: boolean = true;
  private _isContentShown: boolean = false;
  private _shouldShowContent: boolean = true;
  private _shouldAlwaysShow: boolean = false;
  private _isDragging: boolean = false;

  view: MainUIBlockView;
  isHidden: boolean;

  constructor(dependencies) {
    const {
      config,
      eventEmitter,
      rootContainer,
      tooltipService,
      topBlock,
      bottomBlock,
      screen,
    } = dependencies;

    this._eventEmitter = eventEmitter;
    this._topBlock = topBlock;
    this._bottomBlock = bottomBlock;
    this._screen = screen;

    this.isHidden = false;

    const mainBlockConfig = {
      ...DEFAULT_CONFIG,
      ...config.controls,
    };

    this._shouldAlwaysShow = mainBlockConfig.shouldAlwaysShow;

    this._initUI({
      tooltipContainer: tooltipService.tooltipContainerNode,
      topBlock: topBlock.node,
      bottomBlock: bottomBlock.node,
    });
    this._bindViewCallbacks();
    this._bindEvents();

    rootContainer.appendComponentNode(this.view.getNode());

    if (config.controls === false) {
      this.hide();
    }
  }

  get node() {
    return this.view.getNode();
  }

  private _initUI(elements) {
    this.view = new MainUIBlock.View({ elements });
  }

  private _bindViewCallbacks() {
    this._startHideBlockTimeout = this._startHideBlockTimeout.bind(this);
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

  private get _isBlockFocused() {
    return this._bottomBlock.isFocused;
  }

  private _startHideBlockTimeout() {
    this._stopHideBlockTimeout();

    this._tryShowContent();

    this._hideTimeout = setTimeout(this._tryHideContent, HIDE_BLOCK_TIMEOUT);
  }

  private _stopHideBlockTimeout() {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
  }

  private _tryShowContent() {
    if (this._isContentShowingEnabled) {
      this._showContent();
    }
  }

  private _onControlDragStart() {
    this._isDragging = true;
  }

  private _onControlDragEnd() {
    this._isDragging = false;
    this._tryHideContent();
  }

  private _showContent() {
    if (this.isHidden || this._isContentShown) {
      return;
    }

    this._screen.showCursor();

    this._eventEmitter.emit((UI_EVENTS as any).MAIN_BLOCK_SHOW_TRIGGERED);
    this._bottomBlock.showContent();
    this._topBlock.showContent();
    this._isContentShown = true;
  }

  private _tryHideContent() {
    if (
      !this._isBlockFocused &&
      !this._isDragging &&
      !this._shouldShowContent &&
      !this._shouldAlwaysShow
    ) {
      this._hideContent();
    }
  }

  private _hideContent() {
    if (this.isHidden || !this._isContentShown) {
      return;
    }

    if (this._isContentShowingEnabled) {
      this._screen.hideCursor();
    }

    this._eventEmitter.emit((UI_EVENTS as any).MAIN_BLOCK_HIDE_TRIGGERED);
    this._bottomBlock.hideContent();
    this._topBlock.hideContent();
    this._isContentShown = false;
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

  hide() {
    this.isHidden = true;
    this._topBlock.hide();
    this._bottomBlock.hide();
  }

  show() {
    this.isHidden = false;
    this._topBlock.show();
    this._bottomBlock.show();
  }

  /**
   * Method for allowing bottom block to be always shown.
   * @param flag - `true` for showing always
   * @example
   * player.setControlsShouldAlwaysShow(true);
   *
   */
  @playerAPI('setControlsShouldAlwaysShow')
  setShouldAlwaysShow(flag: boolean) {
    this._shouldAlwaysShow = flag;

    if (this._shouldAlwaysShow) {
      this._tryShowContent();
    } else {
      this._startHideBlockTimeout();
    }
  }

  destroy() {
    this._stopHideBlockTimeout();
    this._unbindEvents();
    this.view.destroy();

    this.view = null;
    this._eventEmitter = null;
    this._topBlock = null;
    this._bottomBlock = null;
  }
}
