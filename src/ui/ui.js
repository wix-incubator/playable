import $ from 'jbone';

import VIDEO_EVENTS from '../constants/events/video';
import UI_EVENTS from '../constants/events/ui';

import eventEmitter from '../event-emitter';

import createProgressControl from './controls/progress';
import createPlayControl from './controls/play';

import styles from './ui.css';


function PlayerUI({ $video, vidi }) {
  this.$video = $video;
  this.vidi = vidi;
  this.initWrapper();
  this.initEvents();
  this.initUIEvents();
}

PlayerUI.prototype = {
  initWrapper() {
    this.$wrapper = $('<div>', {
      class: styles['video-wrapper']
    });

    this.generateControls();
    this.$wrapper
      .append(this.$video)
      .append(this.$controls);
  },

  initEvents() {
    eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this.updateProgressControl, this);
    eventEmitter.on(VIDEO_EVENTS.CHUNK_LOADED, this.updateBufferIndicator, this);
    eventEmitter.on(VIDEO_EVENTS.SEEK_ENDED, this.updateBufferIndicator, this);
  },

  startIntervalUpdates() {
    this._interval = setInterval(() => {
      this.updateProgressControl();
      this.updateBufferIndicator();
    }, 100);
  },

  stopIntervalUpdates() {
    clearInterval(this._interval);
  },

  initUIEvents() {
    const video = this.$video[0];
    const vidi = this.vidi;

    eventEmitter
      .on(UI_EVENTS.PLAY_TRIGGERED, () => {
        this.$wrapper.toggleClass(styles['video-playing'], true);
        vidi.play();
        this.startIntervalUpdates();
      });
    eventEmitter
      .on(UI_EVENTS.PAUSE_TRIGGERED, () => {
        this.$wrapper.toggleClass(styles['video-playing'], false);
        vidi.pause();
        this.stopIntervalUpdates();
      });

    eventEmitter
      .on(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED, percent => {
        if (video.duration) {
          video.currentTime = video.duration * percent;
        }
      });
  },

  updateBufferIndicator() {
    const { currentTime, buffered, duration } = this.$video[0];

    if (!buffered.length) {
      return;
    }

    let i = 0;
    while (i < buffered.length - 1 && !(buffered.start(i) < currentTime && currentTime < buffered.end(i))) {
      i += 1;
    }

    const percent = (buffered.end(i) / duration * 100).toFixed(1);
    eventEmitter.emit(UI_EVENTS.UPDATE_BUFFERED_TRIGGERED, percent);
  },

  updateProgressControl() {
    const { duration, currentTime } = this.$video[0];
    const percent = currentTime / duration * 100;

    eventEmitter.emit(UI_EVENTS.UPDATE_PLAYED_TRIGGERED, percent);
  },

  generateControls() {
    const { $control: $progressControl } = createProgressControl();
    const { $control: $playControl } = createPlayControl();

    const $wrapper = $('<div>', {
      class: styles['controls-wrapper']
    });

    const $innerWrapper = $('<div>', {
      class: styles.controls
    });

    $innerWrapper
      .append($playControl)
      .append($progressControl);

    $wrapper
      .append($innerWrapper);

    this.$controls = $wrapper;
  }
};

export default PlayerUI;
