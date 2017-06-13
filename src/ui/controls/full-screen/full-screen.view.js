import $ from 'jbone';

import styles from './full-screen.scss';


export default class FullScreenView {
  static _styles = styles;

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
  }

  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['full-screen-control']
    });

    this.$toggleFullScreenControl = $('<div>', {
      class: `${this.styleNames['full-screen-toggle']} ${this.styleNames.icon}`,
      'data-hook': 'full-screen-button'
    });

    this.$node
      .append(this.$toggleFullScreenControl);

    this._bindEvents();
  }

  _bindEvents() {
    this.$toggleFullScreenControl[0].addEventListener('click', this._callbacks.onToggleFullScreenButtonClick);
  }

  _unbindEvents() {
    this.$toggleFullScreenControl[0].removeEventListener('click', this._callbacks.onToggleFullScreenButtonClick);
  }

  setState({ isInFullScreen }) {
    this.$toggleFullScreenControl.toggleClass(this.styleNames['in-full-screen'], isInFullScreen);
  }

  get styleNames() {
    return this.constructor._styles;
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
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
