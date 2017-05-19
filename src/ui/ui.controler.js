import UI_EVENTS from '../constants/events/ui';

import View from './ui.view';

import Overlay from './overlay/overlay.controler';
import ControlsBlock from './controls/controls.controler';
import Loader from './loader/loader.controler';
import Screen from './screen/screen.controler';

const DEFAULT_CONFIG = {
  size: {},
  overlay: false,
  customUI: {}
};

class PlayerUI {
  constructor({ engine, eventEmitter, config }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
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
    this._proxyMouseEnter = this._proxyMouseEnter.bind(this);
    this._proxyMouseMove = this._proxyMouseMove.bind(this);
    this._proxyMouseLeave = this._proxyMouseLeave.bind(this);
    this._proxyFullScreenChange = this._proxyFullScreenChange.bind(this);
  }

  _initUI() {
    const { width, height } = this.config.size;
    const config = {
      width,
      height,
      callbacks: {
        onMouseEnter: this._proxyMouseEnter,
        onMouseMove: this._proxyMouseMove,
        onMouseLeave: this._proxyMouseLeave,
        onFullScreenStatusChange: this._proxyFullScreenChange
      }
    };

    this.view = new View(config);
  }

  _initComponents() {
    this._initOverlay();

    this._initLoader();

    this._initScreen();

    this._initControls();
  }

  _initScreen() {
    this.screen = new Screen({
      config: this.config.screen,
      engine: this._engine,
      uiView: this.view,
      eventEmitter: this._eventEmitter
    });

    this.view.appendComponentNode(this.screen.node);
  }

  _initOverlay() {
    const config = this.config.overlay;

    if (config === false) {
      return;
    }

    if (typeof config === 'function') {
      this.overlay = new config({
        engine: this._engine,
        eventEmitter: this._eventEmitter,
        uiView: this.view
      });

      this.view.appendComponentNode(this.overlay.getNode());
    } else {
      this.overlay = new Overlay({
        engine: this._engine,
        eventEmitter: this._eventEmitter,
        config: this.config.overlay
      });

      this.view.appendComponentNode(this.overlay.node);
    }
  }

  _initLoader() {
    const config = this.config.loader;

    if (config === false) {
      return;
    }

    this.loader = new Loader({
      engine: this._engine,
      eventEmitter: this._eventEmitter,
      config: this.config.loader
    });

    this.view.appendComponentNode(this.loader.node);
  }

  _initControls() {
    const config = this.config.controls;

    if (config === false) {
      return;
    }

    this.controls = new ControlsBlock({
      engine: this._engine,
      eventEmitter: this._eventEmitter,
      uiView: this.view,
      config
    });

    this.screen.view.appendComponentNode(this.controls.node);
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

      this.screen.view.appendComponentNode(component.getNode());
    });
  }

  _proxyFullScreenChange() {
    this._eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED);
  }

  _proxyMouseEnter() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_ENTER_ON_PLAYER_TRIGGERED);
  }

  _proxyMouseMove() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED);
  }

  _proxyMouseLeave() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED);
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

  enterFullScreen() {
    this.view.enterFullScreen();
  }

  exitFullScreen() {
    this.view.exitFullScreen();
  }

  destroy() {
    if (this.controls) {
      this.controls.destroy();
      delete this.controls;
    }

    if (this.screen) {
      this.screen.destroy();
      delete this.screen;
    }

    if (this.overlay) {
      this.overlay.destroy();
      delete this.overlay;
    }

    if (this.loader) {
      this.loader.destroy();
      delete this.loader;
    }

    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this.config;
  }
}


export default PlayerUI;
