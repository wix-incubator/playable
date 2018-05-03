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

export const AMOUNT_TO_SKIP_SECONDS = 5;
export const AMOUNT_TO_CHANGE_VOLUME = 10;

export default class KeyboardControl {
  static moduleName = 'keyboardControl';
  static dependencies = ['engine', 'eventEmitter', 'rootContainer', 'config'];

  private _isEnabled;
  private _eventEmitter;
  private _engine;
  private _rootNode;
  private _keyboardInterceptor;

  constructor({ config, eventEmitter, rootContainer, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._rootNode = rootContainer.node;

    if (isIPhone() || isIPod() || isIPad() || isAndroid()) {
      this._isEnabled = false;
    } else {
      this._isEnabled = config.disableControlWithKeyboard !== false;
    }

    this._initInterceptor();
    this._attachDefaultControls();
  }

  private _initInterceptor() {
    if (this._isEnabled) {
      this._keyboardInterceptor = new KeyboardInterceptor(this._rootNode);
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
        this._eventEmitter.emit(
          UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED,
        );
        this._engine.togglePlayback();
      },
      [KEYCODES.LEFT_ARROW]: e => {
        if (this._engine.isSeekAvailable) {
          e.preventDefault();
          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(
            UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
          );
          this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
        }
      },
      [KEYCODES.RIGHT_ARROW]: e => {
        if (this._engine.isSeekAvailable) {
          e.preventDefault();
          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED);
          this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
        }
      },
      [KEYCODES.UP_ARROW]: e => {
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(
          UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
        );
        this._engine.setMute(false);
        this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
      },
      [KEYCODES.DOWN_ARROW]: e => {
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(
          UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
        );
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

  addKeyControl(key, callback) {
    if (this._isEnabled) {
      this._keyboardInterceptor.addCallbacks({
        [key]: callback,
      });
    }
  }

  destroy() {
    this._destroyInterceptor();

    this._rootNode = null;
    this._eventEmitter = null;
    this._engine = null;
  }
}