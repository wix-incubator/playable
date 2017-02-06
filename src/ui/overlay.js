import $ from 'jbone';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES }  from '../constants/events/video';
import UI_EVENTS from '../constants/events/ui';

import eventEmitter from '../event-emitter';

import playIconSVG from '../static/svg/controls/play-icon.svg';


import styles from './scss/index.scss';


export default class Overlay {
  constructor({ src, vidi }) {
    this.isHidden = false;

    this.backgroundSrc = src;
    this.vidi = vidi;

    this._bindCallbacks();
    this._initUI();
    this._initEvents();
  }

  get node() {
    return this.$node;
  }

  _bindCallbacks() {
    this._playVideo = this._playVideo.bind(this);
  }

  _initUI() {
    this.$node = $('<div>', {
      class: styles.overlay
    });

    this.$node.css('background-image', `url('${this.backgroundSrc}')`);

    this.$playWrapper = $('<div>', {
      class: styles['play-wrapper']
    })
      .on('click', this._playVideo);

    this.$playButton = $('<img>', {
      src: playIconSVG
    });

    this.$playWrapper.append(this.$playButton);

    this.$node
      .append(this.$playWrapper);
  }

  _initEvents() {
    eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  _updatePlayingStatus(status) {
    if (status === VIDI_PLAYBACK_STATUSES.PLAYING || status === VIDI_PLAYBACK_STATUSES.PLAYING_BUFFERING) {
      if (!this.isHidden) {
        this.hideOverlay();
      }
    } else {
      if (status === VIDI_PLAYBACK_STATUSES.ENDED) {
        this.showOverlay();
      }
    }
  }


  _playVideo() {
    this.vidi.play();

    eventEmitter.emit(UI_EVENTS.PLAY_OVERLAY_TRIGGERED);
  }

  toggleOverlay() {
    if (this.isHidden) {
      this.showOverlay();
    } else {
      this.hideOverlay();
    }
  }

  hideOverlay() {
    this.isHidden = true;
    this.$node.addClass(styles.hidden);
  }

  showOverlay() {
    this.isHidden = false;
    this.$node.removeClass(styles.hidden);
  }
}
