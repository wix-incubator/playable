import $ from 'jbone';

import styles from './overlay.scss';


export default class OverlayView {
  constructor({ callbacks, src }) {
    this._callbacks = callbacks;

    this.$node = $('<div>');

    this.$content = $('<div>', {
      class: styles.overlay
    });

    if (src) {
      this.$content.css('background-image', `url('${src}')`);
    }

    this.$playButton = $('<div>', {
      class: styles.icon
    });

    this.$content
      .append(this.$playButton);

    this.$node
      .append(this.$content);

    this._bindEvents();
  }

  _bindEvents() {
    this.$playButton[0].addEventListener('click', this._callbacks.onPlayClick);
  }

  getNode() {
    return this.$node[0];
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  setBackgroundSrc(src) {
    this.$content.css('background-image', `url('${src}')`);
  }

  _unbindEvents() {
    this.$playButton[0].removeEventListener('click', this._callbacks.onPlayClick);
  }

  destroy() {
    this._unbindEvents();

    this.$node.remove();

    delete this.$content;
    delete this.$playButton;
    delete this.$node;
  }
}
