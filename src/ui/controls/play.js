import $ from 'jbone';

import styles from '../scss/index.scss';

import playIconSVG from '../../static/svg/controls/play-icon.svg';
import pauseIconSVG from '../../static/svg/controls/pause-icon.svg';


export default class PlayControl {
  constructor({ onPlayClick, onPauseClick }) {
    this._callbacks = {
      onPlayClick,
      onPauseClick
    };

    this._initUI();
    this._initEvents();

    this.toggleControlStatus(false);
  }

  get node() {
    return this.$node;
  }

  _initUI() {
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

  _initEvents() {
    this.$playIcon.on('click', this._callbacks.onPlayClick);
    this.$pauseIcon.on('click', this._callbacks.onPauseClick);
  }

  toggleControlStatus(isPlaying) {
    this.$playIcon.toggleClass(styles.hidden, isPlaying);
    this.$pauseIcon.toggleClass(styles.hidden, !isPlaying);
  }
}
