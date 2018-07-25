import { EventEmitter, ListenerFn } from 'eventemitter3';

import logger from './logger';

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

interface ICallbacks {
  [keyCode: string]: ListenerFn;
}

export default class KeyboardInterceptorCore {
  //TODO: Find how to set proper types here
  private _eventEmitter: any;
  private _node: HTMLElement;

  constructor(node: HTMLElement, callbacks?: ICallbacks) {
    this._eventEmitter = new EventEmitter();
    this._node = node;

    callbacks && this._attachCallbacks(callbacks);
    this._bindCallbacks();
    this._bindEvents();
  }

  private _attachCallbacks(callbacks: ICallbacks) {
    Object.keys(callbacks).forEach((keyCode: string) => {
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

  addCallbacks(callbacks: ICallbacks) {
    this._attachCallbacks(callbacks);
  }

  private _processKeyboardInput(e: KeyboardEvent) {
    this._eventEmitter.emit(e.keyCode, e);
  }

  private get _isDestroyed(): boolean {
    return !this._node && !this._eventEmitter;
  }

  destroy() {
    if (this._isDestroyed) {
      logger.warn(
        'KeyboardInterceptor.destroy called after already been destroyed',
      );
      return;
    } else {
      this._unbindEvents();
      this._node = null;
      this._unattachCallbacks();
      this._eventEmitter = null;
    }
  }
}
