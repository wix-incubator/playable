import LiveIndicatorView from './live-indicator.view';
import { STATES, VIDEO_EVENTS } from '../../../constants';

export default class LiveIndicator {
  static View = LiveIndicatorView;
  static dependencies = [
    'engine',
    'screen',
    'eventEmitter',
    'textMap',
    'rootContainer',
  ];

  private _engine;
  private _screen;
  private _eventEmitter;
  private _textMap;
  private _isHidden: boolean = true;
  private _isActive: boolean = false;

  view: LiveIndicatorView;

  constructor({ engine, screen, eventEmitter, textMap, rootContainer }) {
    this._engine = engine;
    this._screen = screen;
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();

    rootContainer.appendComponentNode(this.node);
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
    });
  }

  private _bindCallbacks() {
    this._syncWithLive = this._syncWithLive.bind(this);
  }

  private _bindEvents() {
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._processStateChange,
      this,
    );
  }

  private _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._processStateChange,
      this,
    );
  }

  private _processStateChange({ nextState }) {
    switch (nextState) {
      case STATES.SRC_SET:
        this._toggle(false);
        this._toggleActive(false);
        break;

      case STATES.METADATA_LOADED:
        if (this._engine.isDynamicContent) {
          this._toggle(true);
        }
        break;

      default:
        break;
    }

    if (!this.isHidden) {
      // update active state for dynamic content
      this._toggleActive(
        nextState === STATES.PLAYING && this._engine.isSyncWithLive,
      );
    }
  }

  private _syncWithLive() {
    this._engine.syncWithLive();
  }

  private _toggle(shouldShow: boolean) {
    this._isHidden = !shouldShow;
    this.view.toggle(shouldShow);
  }

  private _toggleActive(shouldActivate: boolean) {
    this._isActive = shouldActivate;
    this.view.toggleActive(shouldActivate);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();

    delete this.view;

    delete this._engine;
    delete this._screen;
    delete this._eventEmitter;
    delete this._textMap;
  }
}
