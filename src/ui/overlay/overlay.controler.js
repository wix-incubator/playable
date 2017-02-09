import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import View from './overlay.view';

import styles from './overlay.scss';


export default class Overlay {
  constructor({ src, eventEmitter, vidi }) {
    this.eventEmitter = eventEmitter;
    this.isHidden = false;

    this.vidi = vidi;

    this._initUI(src);
    this._initEvents();
  }

  get node() {
    return this.view.$node;
  }

  _initUI(src) {
    this.view = new View(src);
  }

  _initEvents() {
    this._playVideo = this._playVideo.bind(this);

    this.view.$playWrapper.on('click', this._playVideo);

    this.eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
  }

  _updatePlayingStatus(status) {
    if (status === VIDI_PLAYBACK_STATUSES.PLAYING || status === VIDI_PLAYBACK_STATUSES.PLAYING_BUFFERING) {
      if (!this.isHidden) {
        this.hideOverlay();
      }
    } else if (status === VIDI_PLAYBACK_STATUSES.ENDED) {
      this.showOverlay();
    }
  }

  _playVideo() {
    this.vidi.play();
    this.hideOverlay();

    this.eventEmitter.emit(UI_EVENTS.PLAY_OVERLAY_TRIGGERED);
  }

  hideOverlay() {
    this.isHidden = true;
    this.view.$node.addClass(styles.hidden);
  }

  showOverlay() {
    this.isHidden = false;
    this.view.$node.removeClass(styles.hidden);
  }
}
