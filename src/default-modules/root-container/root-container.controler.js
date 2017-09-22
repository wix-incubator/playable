import { ElementQueries } from 'css-element-queries';
import focusSource from '../../utils/focus-source';
import focusWithin from '../../utils/focus-within';

import playerAPI from '../../utils/player-api-decorator';

import { UI_EVENTS } from '../../constants/index';

import View from './root-container.view';


export const DEFAULT_CONFIG = {
  fillAllSpace: false,
  overlay: false,
  loadingCover: false,
  customUI: {}
};

class RootContainer {
  static dependencies = ['eventEmitter', 'config', 'engine'];

  constructor({ eventEmitter, config, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config.ui
    };
    this.isHidden = false;

    this._initUI();
    this._initCustomUI();

    this._bindEvents();
  }

  @playerAPI()
  get node() {
    return this.view.getNode();
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.view.setFullScreenStatus, this.view);
  }

  _unbindEvents() {
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.view.setFullScreenStatus, this.view);
  }

  _initUI() {
    const { width, height, fillAllSpace } = this.config;

    const config = {
      width,
      height,
      fillAllSpace
    };

    this.view = new View(config);
  }

  _initCustomUI() {
    this.customComponents = {};
    const keys = Object.keys(this.config.customUI);

    keys.forEach(key => {
      const component = new this.config.customUI[key]({
        engine: this._engine,
        eventEmitter: this._eventEmitter,
        ui: this
      });

      this.customComponents[key] = component;

      this.appendComponentNode(component.getNode());
    });
  }

  appendComponentNode(node) {
    this.view.appendComponentNode(node);
  }

  _enableFocusInterceptors() {
    if (!this._disengageFocusWithin) {
      this._disengageFocusWithin = focusWithin();
    }

    if (!this._disengageFocusSource) {
      focusSource.engage();
      this._disengageFocusSource = focusSource.disengage;
    }
  }

  _disableFocusInterceptors() {
    if (this._disengageFocusSource) {
      this._disengageFocusSource();
      delete this._disengageFocusSource;
    }

    if (this._disengageFocusWithin) {
      this._disengageFocusWithin();
      delete this._disengageFocusWithin;
    }
  }

  @playerAPI()
  attachToElement(node) {
    this._enableFocusInterceptors();

    node.appendChild(this.node);
    ElementQueries.init();
  }

  @playerAPI()
  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  @playerAPI()
  show() {
    this.isHidden = false;
    this.view.show();
  }

  @playerAPI()
  setWidth(width) {
    this.view.setWidth(width);
  }

  @playerAPI()
  setHeight(height) {
    this.view.setHeight(height);
  }

  @playerAPI()
  getWidth() {
    return this.view.getWidth();
  }

  @playerAPI()
  getHeight() {
    return this.view.getHeight();
  }

  @playerAPI()
  setFillAllSpace(flag) {
    this.view.setFillAllSpaceFlag(flag);
  }

  destroy() {
    this._unbindEvents();
    this._disableFocusInterceptors();

    this.view.destroy();
    delete this.view;

    delete this._engine;
    delete this._eventEmitter;
    delete this.config;
  }
}

export default RootContainer;
