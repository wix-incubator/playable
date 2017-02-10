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
  constructor({ vidi, eventEmitter, ...config }) {
    this.eventEmitter = eventEmitter;
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
    const width = this.$video.attr('width');
    const height = this.$video.attr('height');

    this.view = new View(width, height);
  }

  _initComponents() {
    this._initOverlay();
    this.view.$node
      .append(this.overlay.node);

    this.view.$node
      .append(this.$video);

    this._initControls();

    this.view.$node
      .append(this.controls.node);
  }

  _initOverlay() {
    this.overlay = new Overlay({
      vidi: this.vidi,
      eventEmitter: this.eventEmitter,
      src: this.$video.attr('poster')
    });

    if (!this.config.overlay) {
      this.overlay.hide();
    }

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
      eventEmitter: this.eventEmitter,
      $wrapper: this.view.$node,
      ...config
    });

    if (!this.config.controls) {
      this.controls.hide();
    }

    this.$video.removeAttr('controls');
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

  setWidth(width) {
    this.view.$node
      .css({
        width: `${width}px`
      });
  }

  setHeight(height) {
    this.view.$node
      .css({
        height: `${height}px`
      });
  }
}


export default PlayerUI;
