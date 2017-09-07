import get from 'lodash/get';

import { UI_EVENTS } from '../../constants/index';

import KeyboardInterceptor, { KEYCODES } from '../../utils/keyboard-interceptor';


export const AMOUNT_TO_SKIP_SECONDS = 5;
export const AMOUNT_TO_CHANGE_VOLUME = 10;

const DEFAULT_CONFIG = {
  disabled: false
};

export default class KeyboardControl {
  static dependencies = ['engine', 'eventEmitter', 'rootContainer', 'config'];

  constructor({ config, eventEmitter, rootContainer, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._rootNode = rootContainer.node;

    this.config = {
      ...DEFAULT_CONFIG,
      ...get(config, 'ui.keyboardInterceptor')
    };

    this.initInterceptor();
  }

  initInterceptor() {
    if (!this.config.disabled) {
      this._keyboardInterceptor = new KeyboardInterceptor({
        node: this._rootNode,
        callbacks: {
          [KEYCODES.DEBUG_KEY]: e => {
            if (e.ctrlKey && e.shiftKey) {
              this._eventEmitter.emit(UI_EVENTS.DEBUG_PANEL_TRIGGERED);
            }
          },
          [KEYCODES.TAB]: () => {
            this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
            this._eventEmitter.emit(UI_EVENTS.TAB_WITH_KEYBOARD_TRIGGERED);
          },
          [KEYCODES.SPACE_BAR]: e => {
            e.stopPropagation();
            e.preventDefault();
            this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
            this._eventEmitter.emit(UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED);
            this._engine.togglePlayback();
          },
          [KEYCODES.LEFT_ARROW]: e => {
            e.stopPropagation();
            e.preventDefault();
            this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
            this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED);
            this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
          },
          [KEYCODES.RIGHT_ARROW]: e => {
            e.stopPropagation();
            e.preventDefault();
            this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
            this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED);
            this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
          },
          [KEYCODES.UP_ARROW]: e => {
            e.stopPropagation();
            e.preventDefault();
            this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
            this._eventEmitter.emit(UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED);
            this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
          },
          [KEYCODES.DOWN_ARROW]: e => {
            e.stopPropagation();
            e.preventDefault();
            this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
            this._eventEmitter.emit(UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED);
            this._engine.decreaseVolume(AMOUNT_TO_CHANGE_VOLUME);
          }
        }
      });
    }
  }

  destroyInterceptor() {
    if (this._keyboardInterceptor) {
      this._keyboardInterceptor.destroy();
    }
  }

  destroy() {
    this.destroyInterceptor();

    delete this.config;

    delete this._rootNode;
    delete this._eventEmitter;
    delete this._engine;
  }
}
