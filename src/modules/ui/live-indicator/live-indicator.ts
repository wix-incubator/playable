import { ITooltipService } from '../core/tooltip/types';
import LiveIndicatorView from './live-indicator.view';
import { VIDEO_EVENTS, UI_EVENTS, LiveState } from '../../../constants';
import { IEventEmitter } from '../../event-emitter/types';
import { ITextMap } from '../../text-map/types';
import { IPlaybackEngine } from '../../playback-engine/types';
import { ILiveIndicator } from './types';

export default class LiveIndicator implements ILiveIndicator {
  static moduleName = 'liveIndicator';
  static View = LiveIndicatorView;
  static dependencies = ['engine', 'eventEmitter', 'textMap', 'tooltipService'];

  private _engine: IPlaybackEngine;
  private _eventEmitter: IEventEmitter;
  private _textMap: ITextMap;
  private _tooltipService: ITooltipService;
  private _isHidden: boolean = true;
  private _isActive: boolean = false;
  private _isEnded: boolean = false;

  private _unbindEvents: Function;

  view: LiveIndicatorView;

  constructor({
    engine,
    eventEmitter,
    textMap,
    tooltipService,
  }: {
    engine: IPlaybackEngine;
    eventEmitter: IEventEmitter;
    textMap: ITextMap;
    tooltipService: ITooltipService;
  }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._tooltipService = tooltipService;

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  get isHidden(): boolean {
    return this._isHidden;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  show() {
    this._toggle(true);
  }

  hide() {
    this._toggle(false);
  }

  private _initUI() {
    this.view = new LiveIndicator.View({
      callbacks: {
        onClick: this._syncWithLive,
      },
      textMap: this._textMap,
      tooltipService: this._tooltipService,
    });
  }

  private _bindCallbacks() {
    this._syncWithLive = this._syncWithLive.bind(this);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [VIDEO_EVENTS.LIVE_STATE_CHANGED, this._processStateChange],
        [
          UI_EVENTS.PROGRESS_SYNC_BUTTON_MOUSE_ENTER_TRIGGERED,
          () => {
            this.view.toggleActive(true);
          },
        ],
        [
          UI_EVENTS.PROGRESS_SYNC_BUTTON_MOUSE_LEAVE_TRIGGERED,
          () => {
            // NOTE: restore state before mouse enter
            this.view.toggleActive(this._isActive);
          },
        ],
      ],
      this,
    );
  }

  private _processStateChange({ nextState }: { nextState: LiveState }) {
    switch (nextState) {
      case LiveState.NONE:
        this._toggle(false);
        this._toggleActive(false);
        this._toggleEnded(false);
        break;

      case LiveState.INITIAL:
        this._toggle(true);
        break;

      case LiveState.SYNC:
        this._toggleActive(true);
        break;

      case LiveState.NOT_SYNC:
        this._toggleActive(false);
        break;

      case LiveState.ENDED:
        this._toggleActive(false);
        this._toggleEnded(true);
        break;

      default:
        break;
    }
  }

  private _syncWithLive() {
    if (!this._isEnded) {
      this._engine.syncWithLive();
    }
  }

  private _toggle(shouldShow: boolean) {
    this._isHidden = !shouldShow;
    this.view.toggle(shouldShow);
  }

  private _toggleActive(shouldActivate: boolean) {
    this._isActive = shouldActivate;
    this.view.toggleActive(shouldActivate);
  }

  private _toggleEnded(isEnded: boolean) {
    this._isEnded = isEnded;
    this.view.toggleEnded(isEnded);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();

    this.view = null;

    this._engine = null;
    this._eventEmitter = null;
    this._textMap = null;
  }
}
