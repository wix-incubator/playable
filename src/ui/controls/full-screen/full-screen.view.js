import $ from 'jbone';

import styles from './full-screen.scss';


export default class FullScreenView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['full-screen-control']
    });

    this.$toggleFullScreenControl = $('<div>', {
      class: `${styles['full-screen-toggle']} ${styles.icon}`
    });

    this.$node
      .append(this.$toggleFullScreenControl);

    this._bindEvents();
  }

  _bindEvents() {
    this.$toggleFullScreenControl.on('click', this._callbacks.onToggleFullScreenButtonClick);
  }

  setFullScreenStatus(isFullScreen) {
    this.$toggleFullScreenControl.toggleClass(styles['in-full-screen'], isFullScreen);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  _unbindEvents() {
    this.$toggleFullScreenControl.off('click', this._callbacks.onToggleFullScreenButtonClick);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$toggleFullScreenControl;
    delete this.$node;
  }
}
