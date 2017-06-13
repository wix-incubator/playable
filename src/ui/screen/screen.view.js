import $ from 'jbone';

import styles from './screen.scss';


export default class ScreenView {
  static _styles = styles;

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
  }

  constructor({ callbacks, nativeControls, indicateScreenClick }) {
    this._nativeControls = nativeControls;
    this._indicateScreenClick = indicateScreenClick;

    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['screen-block'],
      tabIndex: 0
    });

    if (this._indicateScreenClick) {
      this.$iconContainer = $('<div>', {
        class: `${this.styleNames['icon-container']}`
      });

      this.$icon = $('<div>', {
        class: `${this.styleNames.icon}`
      });

      this.$iconContainer.append(this.$icon);

      this.$node.append(this.$iconContainer);
    }

    this._bindEvents();
  }

  _bindEvents() {
    this.$node[0].addEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].addEventListener('keypress', this._callbacks.onWrapperKeyPress);
  }

  get styleNames() {
    return this.constructor._styles;
  }

  activatePlayIcon() {
    this.$icon.toggleClass(this.styleNames.pause, false);
    this.$icon.toggleClass(this.styleNames.play, true);
  }

  activatePauseIcon() {
    this.$icon.toggleClass(this.styleNames.play, false);
    this.$icon.toggleClass(this.styleNames.pause, true);
  }

  deactivateIcon() {
    this.$icon.toggleClass(this.styleNames.play, false);
    this.$icon.toggleClass(this.styleNames.pause, false);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  appendPlaybackViewNode(node) {
    this.$node.append(node);
    if (this._nativeControls) {
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
