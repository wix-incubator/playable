import $ from 'jbone';

import enterFullScreenIconSVG from './svg/full-screen-enter.svg';
import exitFullScreenIconSVG from './svg/full-screen-exit.svg';

import styles from './full-screen.scss';


export default class FullScreenView {
  constructor() {
    this.$node = $('<div>', {
      class: styles['full-screen-control']
    });

    this.$enterIcon = $('<img>', {
      class: `${styles['full-screen-enter-icon']} ${styles.icon}`,
      src: enterFullScreenIconSVG
    });

    this.$exitIcon = $('<img>', {
      class: `${styles['full-screen-exit-icon']} ${styles.icon}`,
      src: exitFullScreenIconSVG
    });

    this.$node
      .append(this.$enterIcon)
      .append(this.$exitIcon);
  }
}
