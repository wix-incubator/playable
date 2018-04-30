import { EventEmitter } from 'eventemitter3';

export const KEYCODES = {
  SPACE_BAR: 32,
  ENTER: 13,
  TAB: 9,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  DEBUG_KEY: 68,
};

export default class KeyboardInterceptorCore {
  private _eventEmitter;
  private _node;

  constructor(node, callbacks?) {
    this._eventEmitter = new EventEmitter();
    this._node = node;

    callbacks && this._attachCallbacks(callbacks);
    this._bindCallbacks();
    this._bindEvents();
  }

  private _attachCallbacks(callbacks) {
    Object.keys(callbacks).forEach(keyCode => {
      const keyCodeCallbacks = callbacks[keyCode];
      if (Array.isArray(keyCodeCallbacks)) {
        keyCodeCallbacks.forEach(callback =>
          this._eventEmitter.on(keyCode, callback),
        );
      } else {
        this._eventEmitter.on(keyCode, keyCodeCallbacks);
      }
    });
  }

  private _unattachCallbacks() {
    this._eventEmitter.removeAllListeners();
  }

  private _bindCallbacks() {
    this._processKeyboardInput = this._processKeyboardInput.bind(this);
  }

  private _bindEvents() {
    this._node.addEventListener('keydown', this._processKeyboardInput, false);
  }

  private _unbindEvents() {
    this._node.removeEventListener(
      'keydown',
      this._processKeyboardInput,
      false,
    );
  }

  addCallbacks(callbacks) {
    this._attachCallbacks(callbacks);
  }

  private _processKeyboardInput(e) {
    this._eventEmitter.emit(e.keyCode, e);
  }

  destroy() {
    this._unbindEvents();
    this._unattachCallbacks();
    this._eventEmitter = null;

    this._node = null;
  }
}
