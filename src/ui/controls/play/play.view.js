import $ from 'jbone';

import playIconSVG from './svg/play-icon.svg';
import pauseIconSVG from './svg/pause-icon.svg';

import styles from './play.scss';


export default class PlayView {
  constructor() {
    this.$node = $('<div>', {
      class: styles['play-control']
    });

    this.$playIcon = $('<img>', {
      class: `${styles['play-icon']} ${styles.icon}`,
      src: playIconSVG
    });

    this.$pauseIcon = $('<img>', {
      class: `${styles['pause-icon']} ${styles.icon}`,
      src: pauseIconSVG
    });

    this.$node
      .append(this.$pauseIcon)
      .append(this.$playIcon);
  }
}
