import $ from 'jbone';

import enterFullScreenIconSVG from './svg/full-screen.svg';
import exitFullScreenIconSVG from './svg/exit-full-screen.svg';

import styles from './full-screen.scss';


export default class FullScreenView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
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

    this._bindEvents();
  }

  _bindEvents() {
    this.$enterIcon.on('click', this._callbacks.onEnterFullScreenButtonClick);
    this.$exitIcon.on('click', this._callbacks.onExitFullScreenButtonClick);
  }

  setFullScreenStatus(isFullScreen) {
    this.$enterIcon.toggleClass(styles.hidden, isFullScreen);
    this.$exitIcon.toggleClass(styles.hidden, !isFullScreen);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  _unbindEvents() {
    this.$enterIcon.off('click', this._callbacks.onEnterFullScreenButtonClick);
    this.$exitIcon.off('click', this._callbacks.onExitFullScreenButtonClick);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$exitIcon;
    delete this.$enterIcon;
    delete this.$node;
  }
}
