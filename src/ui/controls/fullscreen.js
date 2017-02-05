import $ from 'jbone';

import styles from '../scss/index.scss';

import enterFullscreenIconSVG from '../../static/svg/controls/fullscreen-enter.svg';
import exitFullscreenIconSVG from '../../static/svg/controls/fullscreen-exit.svg';


export default class FullscreenControl {
  constructor({ onEnterFullscreenClick, onExitFullscreenClick }) {
    this._callbacks = {
      onEnterFullscreenClick,
      onExitFullscreenClick
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
      class: styles['fullscreen-control']
    });

    this.$enterIcon = $('<img>', {
      class: `${styles['fullsreen-enter-icon']} ${styles.icon}`,
      src: enterFullscreenIconSVG
    });

    this.$exitIcon = $('<img>', {
      class: `${styles['fullsreen-exit-icon']} ${styles.icon}`,
      src: exitFullscreenIconSVG
    });

    this.$node
      .append(this.$enterIcon)
      .append(this.$exitIcon);
  }

  _initEvents() {
    this.$enterIcon.on('click', this._callbacks.onEnterFullscreenClick);
    this.$exitIcon.on('click', this._callbacks.onExitFullscreenClick);
  }

  toggleControlStatus(isFullscreen) {
    this.$enterIcon.toggleClass(styles.hidden, isFullscreen);
    this.$exitIcon.toggleClass(styles.hidden, !isFullscreen);
  }
}
