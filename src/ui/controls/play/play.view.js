import $ from 'jbone';

import playIconSVG from './svg/play-icon.svg';
import pauseIconSVG from './svg/pause-icon.svg';

import styles from './play.scss';


export default class PlayView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
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

    this._bindEvents();
  }

  _bindEvents() {
    this.$playIcon.on('click', this._callbacks.onPlayButtonClick);
    this.$pauseIcon.on('click', this._callbacks.onPauseButtonClick);
  }

  _unbindEvents() {
    this.$playIcon.off('click', this._callbacks.onPlayButtonClick);
    this.$pauseIcon.off('click', this._callbacks.onPauseButtonClick);
  }

  setPlaybackStatus(isPlaying) {
    this.$playIcon.toggleClass(styles.hidden, isPlaying);
    this.$pauseIcon.toggleClass(styles.hidden, !isPlaying);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$playIcon;
    delete this.$pauseIcon;
    delete this.$node;
  }
}
