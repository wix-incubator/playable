import $ from 'jbone';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../constants/events/video';

import eventEmitter from '../event-emitter';

import Overlay from './overlay';
import ControlsBlock from './controls';

import styles from './scss/index.scss';


const DEFAULT_CONFIG = {
  overlay: true,
  controls: true,
  timeIndicator: true,
  progressControl: true,
  volumeControl: true,
  volume: 100,
  fullscreenControl: true,
};

class PlayerUI {
  constructor({ vidi, ...config}) {
    this.$video = $(vidi.getVideoElement());
    this.vidi = vidi;
    this.config = Object.assign({}, DEFAULT_CONFIG, config);

    this._initWrapper();
    this._initEvents();
  }

  _initWrapper() {
    this.$wrapper = $('<div>', {
      class: styles['video-wrapper']
    });

    if (this.config.overlay) {
      this._initOverlay();
      this.$wrapper
        .append(this.overlay.node);
    }

    this.$wrapper
      .append(this.$video);

    if (this.config.controls) {
      this._initControls();

      this.$wrapper
        .append(this.controls.node);
    }
  }

  _initEvents() {
    eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  _updatePlayingStatus(status) {
    if (status === VIDI_PLAYBACK_STATUSES.PLAYING || status === VIDI_PLAYBACK_STATUSES.PLAYING_BUFFERING) {
      this.$wrapper.toggleClass(styles['video-playing'], true);
    } else {
      this.$wrapper.toggleClass(styles['video-playing'], false);
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
    const config = this.config;

    this.controls = new ControlsBlock({
      vidi: this.vidi,
      $wrapper: this.$wrapper,
      ...config
    });

    this.$video.removeAttr('controls');
  }
}

export default PlayerUI;
