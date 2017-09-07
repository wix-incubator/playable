export const KEYCODES = {
  SPACE_BAR: 32,
  ENTER: 13,
  TAB: 9,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  DEBUG_KEY: 68
};

export default class KeyboardInterceptorCore {
  constructor(config) {
    this.config = config;
    this._bindCallbacks();
    this._bindEvents();
  }

  _bindCallbacks() {
    this._processKeyboardInput = this._processKeyboardInput.bind(this);
  }

  _bindEvents() {
    this.config.node.addEventListener('keydown', this._processKeyboardInput, false);
  }

  _unbindEvents() {
    this.config.node.removeEventListener('keydown', this._processKeyboardInput, false);
  }

  _processKeyboardInput(e) {
    if (this.config.callbacks[e.keyCode]) {
      this.config.callbacks[e.keyCode](e);
    }
  }

  destroy() {
    this._unbindEvents();

    delete this.config;
  }
}
