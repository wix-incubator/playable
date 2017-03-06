import { isFullscreenAPIExist } from '../utils/fullscreen';

import UI_EVENTS from '../constants/events/ui';

import View from './ui.view';

import Overlay from './overlay/overlay.controler';
import ControlsBlock from './controls/controls.controler';


const DEFAULT_CONFIG = {
  size: {},
  overlay: true,
  controls: true,
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
    this.view.appendComponentNode(this.overlay.node);

    this.view.appendComponentNode(this.vidi.getVideoElement());

    this._initControls();

    this.view.appendComponentNode(this.controls.node);
  }

  _initOverlay() {
    this.overlay = new Overlay({
      vidi: this.vidi,
      eventEmitter: this.eventEmitter,
      config: this.config.overlay
    });

    if (!this.config.overlay) {
      this.overlay.hide();
    }
  }

  _initControls() {
    let config;
    if (this.config.controls === true) {
      config = {};
    } else {
      config = this.config.controls;
    }

    if (!isFullscreenAPIExist) {
      config = {
        ...config,
        fullscreen: false
      };
    }

    this.controls = new ControlsBlock({
      vidi: this.vidi,
      eventEmitter: this.eventEmitter,
      uiView: this.view,
      config
    });

    if (!this.config.controls) {
      this.controls.hide();
    }
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

  hideControls() {
    this.controls.hide();
  }

  showControls() {
    this.controls.show();
  }

  hideOverlay() {
    this.overlay.hide();
  }

  showOverlay() {
    this.overlay.show();
  }

  setOverlayBackgroundSrc(src) {
    this.overlay.setBackgroundSrc(src);
  }

  setWidth(width) {
    this.view.setWidth(width);
  }

  setHeight(height) {
    this.view.setHeight(height);
  }

  hideTime() {
    this.controls.timeControl.hide();
  }

  showTime() {
    this.controls.timeControl.show();
  }

  hideProgress() {
    this.controls.progressControl.hide();
  }

  showProgress() {
    this.controls.progressControl.show();
  }

  hideVolume() {
    this.controls.volumeControl.hide();
  }

  showVolume() {
    this.controls.volumeControl.show();
  }

  hideFullscreen() {
    this.controls.fullscreenControl.hide();
  }

  showFullscreen() {
    this.controls.fullscreenControl.show();
  }

  destroy() {
    this.view.destroy();
    delete this.view;

    this.controls.destroy();
    delete this.controls;

    this.overlay.destroy();
    delete this.overlay;

    delete this.eventEmitter;
    delete this.vidi;
    delete this.config;
  }
}


export default PlayerUI;
