import get from 'lodash/get';

import KeyboardInterceptor, { KEYCODES } from '../../../../utils/keyboard-interceptor';

import { UI_EVENTS } from '../../../../constants/index';
import View from './logo.view';


export default class Logo {
  static View = View;
  static dependencies = ['engine', 'config', 'eventEmitter', 'textMap'];

  constructor({ engine, eventEmitter, config, textMap }) {
    this._config = {
      ...get(config, 'ui.controls.logo')
    };

    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._textMap = textMap;

    this._bindCallbacks();

    this._initUI();
    this._initInterceptor();

    this.setLogo(this._config.src);
    this.setLogoClickCallback(this._config.callback);
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._triggerCallback = this._triggerCallback.bind(this);
  }

  _initUI() {
    const config = {
      callbacks: {
        onLogoClick: this._triggerCallback
      },
      texts: this._textMap
    };

    this.view = new this.constructor.View(config);
  }

  _initInterceptor() {
    this._interceptor = new KeyboardInterceptor({
      node: this.view.$logo[0],
      callbacks: {
        [KEYCODES.SPACE_BAR]: e => {
          e.stopPropagation();
          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._triggerCallback();
        },
        [KEYCODES.ENTER]: e => {
          e.stopPropagation();
          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._triggerCallback();
        }
      }
    });
  }

  _destroyInterceptor() {
    this._interceptor.destroy();
  }

  _triggerCallback() {
    if (this._callback) {
      this._callback();
    }
  }

  setLogo(url) {
    this.view.setLogo(url);
  }

  setLogoClickCallback(callback) {
    this._callback = callback;
    this.view.setDisplayAsLink(Boolean(this._callback));
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  destroy() {
    this._destroyInterceptor();
    this.view.destroy();
    delete this.view;

    delete this._engine;
    delete this._eventEmitter;
    delete this._textMap;

    delete this.isHidden;
  }
}
