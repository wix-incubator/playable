import $ from 'jbone';

import { isFullscreenAPIExist } from '../utils/fullscreen';

import View from './ui.view';

import Overlay from './overlay/overlay.controler';
import ControlsBlock from './controls/controls.controler';


const DEFAULT_CONFIG = {
  overlay: true,
  controls: true,
  timeIndicator: true,
  progressControl: true,
  volumeControl: true,
  fullscreenControl: true
};

class PlayerUI {
  constructor({ vidi, ...config }) {
    this.$video = $(vidi.getVideoElement());
    this.vidi = vidi;
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    this._initUI();
    this._initComponents();
  }

  get node() {
    return this.view.$node;
  }

  _initUI() {
    this.view = new View();
  }

  _initComponents() {
    if (this.config.overlay) {
      this._initOverlay();
      this.view.$node
        .append(this.overlay.node);
    }

    this.view.$node
      .append(this.$video);

    if (this.config.controls) {
      this._initControls();

      this.view.$node
        .append(this.controls.node);
    }
  }

  _initOverlay() {
    this.overlay = new Overlay({
      vidi: this.vidi,
      src: this.$video.attr('poster')
    });

    this.$video.removeAttr('poster');
  }

  _initControls() {
    let config = this.config;
    if (!isFullscreenAPIExist) {
      config = {
        ...config,
        fullscreenControl: false
      };
    }

    this.controls = new ControlsBlock({
      vidi: this.vidi,
      $wrapper: this.view.$node,
      ...config
    });

    this.$video.removeAttr('controls');
  }
}

export default PlayerUI;
