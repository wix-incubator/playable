import $ from 'jbone';

import styles from './overlay.scss';


export default class OverlayView {
  static _styles = styles;

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
  }

  constructor({ callbacks, src }) {
    this._callbacks = callbacks;

    this.$node = $('<div>');

    this.$content = $('<div>', {
      class: this.styleNames.overlay
    });

    if (src) {
      this.$content.css('background-image', `url('${src}')`);
    }

    this.$playButton = $('<div>', {
      class: this.styleNames.icon
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

  get styleNames() {
    return this.constructor._styles;
  }

  getNode() {
    return this.$node[0];
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
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
