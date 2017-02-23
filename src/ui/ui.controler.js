import { isFullscreenAPIExist } from '../utils/fullscreen';

import View from './ui.view';

import Overlay from './overlay/overlay.controler';
import ControlsBlock from './controls/controls.controler';

import styles from './ui.scss';


const DEFAULT_CONFIG = {
  size: {},
  overlay: true,
  controls: true
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
    this._initUI();
    this._initComponents();
  }

  get node() {
    return this.view.$node;
  }

  _initUI() {
    const { width, height } = this.config.size;

    this.view = new View(width, height);
  }

  _initComponents() {
    this._initOverlay();
    this.view.$node
      .append(this.overlay.node);

    this.view.$node
      .append(this.vidi.getVideoElement());

    this._initControls();

    this.view.$node
      .append(this.controls.node);
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
      $wrapper: this.view.$node,
      config
    });

    if (!this.config.controls) {
      this.controls.hide();
    }
  }

  hide() {
    this.isHidden = true;
    this.view.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.isHidden = false;
    this.view.$node.toggleClass(styles.hidden, false);
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
    if (!width) {
      return;
    }

    this.view.$node
      .css({
        width: `${width}px`
      });
  }

  setHeight(height) {
    if (!height) {
      return;
    }

    this.view.$node
      .css({
        height: `${height}px`
      });
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
    delete this.$video;
    delete this.vidi;
    delete this.config;
  }
}


export default PlayerUI;
