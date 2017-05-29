import $ from 'jbone';

import styles from './screen.scss';


export default class ScreenView {
  constructor({ callbacks, nativeControls }) {
    this.nativeControls = nativeControls;
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['screen-block'],
      tabIndex: 0
    });

    this.$iconContainer = $('<div>', {
      class: `${styles['icon-container']}`
    });

    this.$icon = $('<div>', {
      class: `${styles.icon}`
    });

    this.$iconContainer.append(this.$icon);

    this.$node.append(this.$iconContainer);

    this._bindEvents();
  }

  _bindEvents() {
    this.$node[0].addEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].addEventListener('keypress', this._callbacks.onWrapperKeyPress);
  }

  activatePlayIcon() {
    this.$icon.toggleClass(styles.pause, false);
    this.$icon.toggleClass(styles.play, true);
  }

  activatePauseIcon() {
    this.$icon.toggleClass(styles.play, false);
    this.$icon.toggleClass(styles.pause, true);
  }

  deactivateIcon() {
    this.$icon.toggleClass(styles.play, false);
    this.$icon.toggleClass(styles.pause, false);
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

  appendPlaybackViewNode(node) {
    this.$node.append(node);
    if (this.nativeControls) {
      node.setAttribute('controls', 'true');
    }
  }

  _unbindEvents() {
    this.$node[0].removeEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].removeEventListener('keypress', this._callbacks.onWrapperKeyPress);
  }

  appendComponentNode(node) {
    this.$node.append(node);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}
