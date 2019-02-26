import { UI_EVENTS } from '../../constants';
import {
  isIPhone,
  isIPod,
  isIPad,
  isAndroid,
} from '../../utils/device-detection';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../utils/keyboard-interceptor';

import { IEventEmitter } from '../event-emitter/types';
import { IPlaybackEngine } from '../playback-engine/types';
import { IPlayerConfig } from '../../core/config';
import { IKeyboardControl } from './types';
import { IRootContainer } from '../root-container/types';
import { ListenerFn } from 'eventemitter3';

export const AMOUNT_TO_SKIP_SECONDS = 5;
export const AMOUNT_TO_CHANGE_VOLUME = 10;

export default class KeyboardControl implements IKeyboardControl {
  static moduleName = 'keyboardControl';
  static dependencies = ['engine', 'eventEmitter', 'rootContainer', 'config'];

  private _isEnabled: boolean;
  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _keyboardInterceptor: KeyboardInterceptor;

  constructor({
    config,
    eventEmitter,
    rootContainer,
    engine,
  }: {
    config: IPlayerConfig;
    eventEmitter: IEventEmitter;
    rootContainer: IRootContainer;
    engine: IPlaybackEngine;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    if (isIPhone() || isIPod() || isIPad() || isAndroid()) {
      this._isEnabled = false;
    } else {
      this._isEnabled = config.disableControlWithKeyboard !== false;
    }

    this._initInterceptor(rootContainer.getElement());
  }

  private _initInterceptor(rootElement: HTMLElement) {
    if (this._isEnabled) {
      this._keyboardInterceptor = new KeyboardInterceptor(rootElement);
      this._attachDefaultControls();
    }
  }

  private _attachDefaultControls() {
    this._keyboardInterceptor.addCallbacks({
      [KEYCODES.TAB]: () => {
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
      },
      [KEYCODES.SPACE_BAR]: e => {
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD);
        this._engine.togglePlayback();
      },
      [KEYCODES.LEFT_ARROW]: e => {
        if (this._engine.isSeekAvailable) {
          e.preventDefault();
          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD);
          this._engine.seekBackward(AMOUNT_TO_SKIP_SECONDS);
        }
      },
      [KEYCODES.RIGHT_ARROW]: e => {
        if (this._engine.isSeekAvailable) {
          e.preventDefault();
          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD);
          this._engine.seekForward(AMOUNT_TO_SKIP_SECONDS);
        }
      },
      [KEYCODES.UP_ARROW]: e => {
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD);
        this._engine.setMute(false);
        this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
      },
      [KEYCODES.DOWN_ARROW]: e => {
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD);
        this._engine.setMute(false);
        this._engine.decreaseVolume(AMOUNT_TO_CHANGE_VOLUME);
      },
    });
  }

  private _destroyInterceptor() {
    if (this._keyboardInterceptor) {
      this._keyboardInterceptor.destroy();
    }
  }

  addKeyControl(key: number, callback: ListenerFn) {
    if (this._isEnabled) {
      this._keyboardInterceptor.addCallbacks({
        [key]: callback,
      });
    }
  }

  destroy() {
    this._destroyInterceptor();
  }
}
