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

  destroy() {
    this.$node.remove();

    delete this.$currentTime;
    delete this.$divider;
    delete this.$durationTime;
    delete this.$node;
  }
}
