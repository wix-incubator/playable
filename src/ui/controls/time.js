import $ from 'jbone';

import styles from '../scss/index.scss';


export default class TimeControl {
  constructor() {
    this._initUI();

    this.setCurrentTime(0);
    this.setDurationTime(0);
  }

  get node() {
    return this.$node;
  }

  _formatTime(seconds) {
    const date = new Date(null);
    seconds = isNaN(seconds) || !isFinite(seconds) ? 0 : Math.floor(seconds);
    date.setSeconds(seconds);

    // get HH:mm:ss part, remove hours if they are "00:"
    return date
      .toISOString()
      .substr(11, 8)
      .replace(/^00:/, '');
  }

  _initUI() {
    this.$node = $('<div>', {
      class: styles['time-wrapper']
    });

    this.$currentTime = $('<span>', {
      class: `${styles.current} ${styles.time}`
    });
    this.$divider = $('<span>', {
      class: styles.time
    })
      .html('/');
    this.$durationTime = $('<span>', {
      class: `${styles.duration} ${styles.time}`
    });

    this.$node
      .append(this.$currentTime)
      .append(this.$divider)
      .append(this.$durationTime);
  }

  setDurationTime(time) {
    this.$durationTime.html(this._formatTime(time));
  }

  setCurrentTime(time) {
    this.$currentTime.html(this._formatTime(time));
  }
}
