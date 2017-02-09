import $ from 'jbone';

import styles from './time.scss';


export default class TimeView {
  constructor() {
    this.$node = $('<div>', {
      class: styles['time-wrapper']
    });

    this.$currentTime = $('<span>', {
      class: `${styles.current} ${styles.time}`
    });
    const $divider = $('<span>', {
      class: styles.time
    })
      .html('/');
    this.$durationTime = $('<span>', {
      class: `${styles.duration} ${styles.time}`
    });

    this.$node
      .append(this.$currentTime)
      .append($divider)
      .append(this.$durationTime);
  }
}
