import { VideoEvent, UIEvent, LiveState } from '../../../constants';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../utils/keyboard-interceptor';

import LiveIndicatorView from './live-indicator.view';

import { ITooltipService } from '../core/tooltip/types';

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

  private _interceptor: KeyboardInterceptor;

  private _isHidden: boolean = true;
  private _isActive: boolean = false;
  private _isEnded: boolean = false;

  private _unbindEvents: () => void;

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

    this._initInterceptor();
  }

  getElement() {
    return this.view.getElement();
  }

  private _initInterceptor() {
    this._interceptor = new KeyboardInterceptor(this.getElement(), {
      [KEYCODES.SPACE_BAR]: e => {
        e.stopPropagation();
        this._eventEmitter.emit(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._syncWithLive();
      },
      [KEYCODES.ENTER]: e => {
        e.stopPropagation();
        this._eventEmitter.emit(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._syncWithLive();
      },
    });
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
        [VideoEvent.LIVE_STATE_CHANGED, this._processStateChange],
        [
          UIEvent.PROGRESS_SYNC_BUTTON_MOUSE_ENTER,
          () => {
            this.view.toggleActive(true);
          },
        ],
        [
          UIEvent.PROGRESS_SYNC_BUTTON_MOUSE_LEAVE,
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

    this._interceptor.destroy();

    this.view.destroy();
  }
}
