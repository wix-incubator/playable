import UI_EVENTS from '../constants/events/ui';

import View from './ui.view';

import Overlay from './overlay/overlay.controler';
import ControlsBlock from './controls/controls.controler';
import Loader from './loader/loader.controler';


const DEFAULT_CONFIG = {
  size: {},
  overlay: false,
  customUI: {}
};

class PlayerUI {
  constructor({ vidi, eventEmitter, config }) {
    this.eventEmitter = eventEmitter;
    this.vidi = vidi;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
    this.isHidden = false;

    this._bindCallbacks();
    this._initUI();

    this._initComponents();
    this._initCustomUI();
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._proxyFullScreenChange = this._proxyFullScreenChange.bind(this);
  }

  _initUI() {
    const { width, height } = this.config.size;
    const config = {
      width,
      height,
      callbacks: {
        onFullScreenStatusChange: this._proxyFullScreenChange
      }
    };

    this.view = new View(config);
  }

  _initComponents() {
    this._initOverlay();

    this._initLoader();

    this.view.appendComponentNode(this.vidi.getVideoElement());

    this._initControls();
  }

  _initOverlay() {
    const config = this.config.overlay;

    if (config === false) {
      return;
    }

    if (typeof config === 'function') {
      this.overlay = new config({
        vidi: this.vidi,
        eventEmitter: this.eventEmitter,
        uiView: this.view
      });

      this.view.appendComponentNode(this.overlay.getNode());
    } else {
      this.overlay = new Overlay({
        vidi: this.vidi,
        eventEmitter: this.eventEmitter,
        config: this.config.overlay
      });

      this.view.appendComponentNode(this.overlay.node);
    }
  }

  _initLoader() {
    this.loader = new Loader({
      vidi: this.vidi,
      eventEmitter: this.eventEmitter
    });

    this.view.appendComponentNode(this.loader.node);
  }

  _initControls() {
    const config = this.config.controls;

    if (config === false) {
      return;
    }

    this.controls = new ControlsBlock({
      vidi: this.vidi,
      eventEmitter: this.eventEmitter,
      uiView: this.view,
      config
    });

    this.view.appendComponentNode(this.controls.node);
  }

  _initCustomUI() {
    this.customComponents = {};
    const keys = Object.keys(this.config.customUI);
    keys.forEach(key => {
      const component = new this.config.customUI[key]({
        vidi: this.vidi,
        eventEmitter: this.eventEmitter,
        uiView: this.view
      });

      this.customComponents[key] = component;

      this.view.appendComponentNode(component.getNode());
    });
  }

  _proxyFullScreenChange() {
    this.eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED);
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  setWidth(width) {
    this.view.setWidth(width);
  }

  setHeight(height) {
    this.view.setHeight(height);
  }

  destroy() {
    this.view.destroy();
    delete this.view;

    if (this.controls) {
      this.controls.destroy();
      delete this.controls;
    }

    if (this.overlay) {
      this.overlay.destroy();
      delete this.overlay;
    }

    delete this.eventEmitter;
    delete this.vidi;
    delete this.config;
  }
}


export default PlayerUI;
