import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';
import playerAPI from '../../../core/player-api-decorator';

import MainUIBlockView from './main-ui-block.view';

import { IMainUIBlock, IMainUIBlockViewElements } from './types';
import { IEventEmitter } from '../../event-emitter/types';
import { IBottomBlock } from '../bottom-block/types';
import { ITopBlock } from '../top-block/types';
import { IScreen } from '../screen/types';
import { IPlayerConfig } from '../../../core/config';
import { IRootContainer } from '../../root-container/types';
import { ITooltipService } from '../core/tooltip/tooltip-service';

const HIDE_BLOCK_TIMEOUT = 2000;

export default class MainUIBlock implements IMainUIBlock {
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

  private _eventEmitter: IEventEmitter;
  private _bottomBlock: IBottomBlock;
  private _topBlock: ITopBlock;
  private _screen: IScreen;
  private _tooltipService: ITooltipService;

  private _hideTimeout: number = null;

  private _isContentShowingEnabled: boolean = true;
  private _isContentShown: boolean = false;
  private _shouldShowContent: boolean = true;
  private _shouldAlwaysShow: boolean = false;
  private _isDragging: boolean = false;

  private _unbindEvents: () => void;

  view: MainUIBlockView;
  isHidden: boolean;

  constructor(dependencies: {
    config: IPlayerConfig;
    eventEmitter: IEventEmitter;
    rootContainer: IRootContainer;
    tooltipService: ITooltipService;
    topBlock: ITopBlock;
    bottomBlock: IBottomBlock;
    screen: IScreen;
  }) {
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
    this._tooltipService = tooltipService;

    this.isHidden = false;

    this._shouldAlwaysShow = false;

    this._initUI({
      tooltipContainer: tooltipService.tooltipContainerElement,
      topBlock: topBlock.getElement(),
      bottomBlock: bottomBlock.getElement(),
    });
    this._bindViewCallbacks();
    this._bindEvents();

    rootContainer.appendComponentElement(this.view.getElement());

    if (config.hideMainUI) {
      this.hide();
    }
  }

  getElement() {
    return this.view.getElement();
  }

  private _initUI(elements: IMainUIBlockViewElements) {
    this.view = new MainUIBlock.View({ elements });
  }

  private _bindViewCallbacks() {
    this._startHideBlockTimeout = this._startHideBlockTimeout.bind(this);
    this._tryShowContent = this._tryShowContent.bind(this);
    this._tryHideContent = this._tryHideContent.bind(this);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [UI_EVENTS.MOUSE_MOVE_ON_PLAYER, this._startHideBlockTimeout],
        [UI_EVENTS.MOUSE_LEAVE_ON_PLAYER, this._tryHideContent],
        [UI_EVENTS.FOCUS_ENTER_ON_PLAYER, this._startHideBlockTimeout],
        [UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED, this._startHideBlockTimeout],
        [UI_EVENTS.LOADER_HIDE, this._startHideBlockTimeout],
        [VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingState],
        [UI_EVENTS.CONTROL_DRAG_START, this._onControlDragStart],
        [UI_EVENTS.CONTROL_DRAG_END, this._onControlDragEnd],
      ],
      this,
    );
  }

  private _updatePlayingState({ nextState }: { nextState: EngineState }) {
    switch (nextState) {
      case EngineState.PLAY_REQUESTED: {
        this._shouldShowContent = false;
        this._startHideBlockTimeout();
        break;
      }
      case EngineState.ENDED: {
        this._shouldShowContent = true;
        this._tryShowContent();
        break;
      }
      case EngineState.PAUSED: {
        this._shouldShowContent = true;
        this._tryShowContent();
        break;
      }
      case EngineState.SRC_SET: {
        this._shouldShowContent = true;
        this._tryShowContent();
        break;
      }
      default:
        break;
    }
  }

  private get _isBlockFocused() {
    return this._bottomBlock.isFocused || this._topBlock.isFocused;
  }

  private _startHideBlockTimeout() {
    this._stopHideBlockTimeout();

    this._tryShowContent();

    this._hideTimeout = window.setTimeout(
      this._tryHideContent,
      HIDE_BLOCK_TIMEOUT,
    );
  }

  private _stopHideBlockTimeout() {
    if (this._hideTimeout) {
      window.clearTimeout(this._hideTimeout);
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

    this._eventEmitter.emit((UI_EVENTS as any).MAIN_BLOCK_SHOW);
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

    this._eventEmitter.emit((UI_EVENTS as any).MAIN_BLOCK_HIDE);
    this._bottomBlock.hideContent();
    this._topBlock.hideContent();
    this._tooltipService.hide();
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
   * Method for allowing main ui to be always shown despite the playback state and the cursor position
   * @param flag - `true` for showing always
   * @example
   * player.setMainUIShouldAlwaysShow(true);
   *
   */
  @playerAPI('setMainUIShouldAlwaysShow')
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
  }
}
