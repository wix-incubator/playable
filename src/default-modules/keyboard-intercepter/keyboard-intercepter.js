import get from 'lodash/get';

import { UI_EVENTS } from '../../constants/index';


export const SPACE_BAR_KEYCODE = 32;
export const LEFT_ARROW_KEYCODE = 37;
export const RIGHT_ARROW_KEYCODE = 39;
export const UP_ARROW_KEYCODE = 38;
export const DOWN_ARROW_KEYCODE = 40;
export const TAB_KEYCODE = 9;

export const AMOUNT_TO_SKIP_SECONDS = 5;
export const AMOUNT_TO_CHANGE_VOLUME = 10;

const DEFAULT_CONFIG = {
  disabled: false
};

export default class KeyboardInterceptor {
  static dependencies = ['engine', 'eventEmitter', 'rootContainer', 'config'];

  constructor({ config, eventEmitter, rootContainer, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._rootNode = rootContainer.node;

    this.config = {
      ...DEFAULT_CONFIG,
      ...get(config, 'ui.keyboardInterceptor')
    };

    this._bindCallbacks();
    this._bindEvents();
  }

  _bindCallbacks() {
    this._processKeyboardInput = this._processKeyboardInput.bind(this);
  }

  _bindEvents() {
    this._rootNode.addEventListener('keydown', this._processKeyboardInput);
  }

  _unbindEvents() {
    this._rootNode.removeEventListener('keydown', this._processKeyboardInput);
  }

  _processKeyboardInput(e) {
    if (this.config.disabled) {
      return;
    }

    switch (e.keyCode) {
      case TAB_KEYCODE:
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.TAB_WITH_KEYBOARD_TRIGGERED);
        break;
      case SPACE_BAR_KEYCODE:
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED);
        this._engine.togglePlayback();
        break;
      case LEFT_ARROW_KEYCODE:
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED);
        this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
        break;
      case RIGHT_ARROW_KEYCODE:
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED);
        this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
        break;
      case UP_ARROW_KEYCODE:
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED);
        this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
        break;
      case DOWN_ARROW_KEYCODE:
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED);
        this._engine.decreaseVolume(AMOUNT_TO_CHANGE_VOLUME);
        break;
      default: break;
    }
  }

  destroy() {
    this._unbindEvents();

    delete this.config;

    delete this._rootNode;
    delete this._eventEmitter;
    delete this._engine;
  }
}
