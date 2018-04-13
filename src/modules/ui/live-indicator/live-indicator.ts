import { ITooltipService } from '../core/tooltip';
import LiveIndicatorView from './live-indicator.view';
import { VIDEO_EVENTS, LiveState } from '../../../constants';

export default class LiveIndicator {
  static moduleName = 'liveIndicator';
  static View = LiveIndicatorView;
  static dependencies = ['engine', 'eventEmitter', 'textMap', 'tooltipService'];

  private _engine;
  private _eventEmitter;
  private _textMap;
  private _tooltipService: ITooltipService;
  private _isHidden: boolean = true;
  private _isActive: boolean = false;
  private _isEnded: boolean = false;

  view: LiveIndicatorView;

  constructor({ engine, eventEmitter, textMap, tooltipService }) {
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
    this._eventEmitter.on(
      VIDEO_EVENTS.LIVE_STATE_CHANGED,
      this._processStateChange,
      this,
    );
  }

  private _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.LIVE_STATE_CHANGED,
      this._processStateChange,
      this,
    );
  }

  private _processStateChange({ nextState }) {
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

    delete this.view;

    delete this._engine;
    delete this._eventEmitter;
    delete this._textMap;
  }
}
