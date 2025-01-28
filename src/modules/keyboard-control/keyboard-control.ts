import { UIEvent } from '../../constants';
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
import { ListenerFn } from 'eventemitter3';
import { IFocusScreen } from '../ui/focus-screen/types';

export const AMOUNT_TO_SKIP_SECONDS = 5;
export const AMOUNT_TO_CHANGE_VOLUME = 10;

export default class KeyboardControl implements IKeyboardControl {
  static moduleName = 'keyboardControl';
  static dependencies = ['engine', 'eventEmitter', 'focusScreen', 'config'];

  private _isEnabled: boolean;
  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _keyboardInterceptor: KeyboardInterceptor;

  constructor({
    config,
    eventEmitter,
    focusScreen,
    engine,
  }: {
    config: IPlayerConfig;
    eventEmitter: IEventEmitter;
    focusScreen: IFocusScreen;
    engine: IPlaybackEngine;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    if (isIPhone() || isIPod() || isIPad() || isAndroid()) {
      this._isEnabled = false;
    } else {
      this._isEnabled = config.disableControlWithKeyboard !== false;
    }

    this._initInterceptor(focusScreen.getElement());
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
        this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
      },
      [KEYCODES.SPACE_BAR]: e => {
        e.preventDefault();
        this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emitAsync(UIEvent.TOGGLE_PLAYBACK_WITH_KEYBOARD);
        this._engine.togglePlayback();
      },
      [KEYCODES.LEFT_ARROW]: e => {
        if (this._engine.isSeekAvailable) {
          e.preventDefault();
          this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emitAsync(UIEvent.GO_BACKWARD_WITH_KEYBOARD);
          this._engine.seekBackward(AMOUNT_TO_SKIP_SECONDS);
        }
      },
      [KEYCODES.RIGHT_ARROW]: e => {
        if (this._engine.isSeekAvailable) {
          e.preventDefault();
          this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emitAsync(UIEvent.GO_FORWARD_WITH_KEYBOARD);
          this._engine.seekForward(AMOUNT_TO_SKIP_SECONDS);
        }
      },
      [KEYCODES.UP_ARROW]: e => {
        e.preventDefault();
        this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emitAsync(UIEvent.INCREASE_VOLUME_WITH_KEYBOARD);
        this._engine.setMute(false);
        this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
      },
      [KEYCODES.DOWN_ARROW]: e => {
        e.preventDefault();
        this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emitAsync(UIEvent.DECREASE_VOLUME_WITH_KEYBOARD);
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
