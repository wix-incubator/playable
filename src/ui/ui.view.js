import $ from 'jbone';

import fullscreen from '../utils/fullscreen';

import styles from './ui.scss';


export default class PlayerUIView {
  constructor({ width, height, callbacks }) {
    this._callbacks = callbacks;

    this.$node = $('<div>', {
      class: styles['video-wrapper']
    });

    if (width) {
      this.$node.css({
        width: `${width}px`
      });
    }

    if (height) {
      this.$node.css({
        height: `${height}px`
      });
    }

    this._bindEvents();
  }

  _bindEvents() {
    this.$node.on(fullscreen.raw.fullscreenchange, this._callbacks.onFullScreenStatusChange);
  }

  setWidth(width) {
    if (!width) {
      return;
    }

    this.$node
      .css({
        width: `${width}px`
      });
  }

  setHeight(height) {
    if (!height) {
      return;
    }

    this.$node
      .css({
        height: `${height}px`
      });
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  appendComponentNode(node) {
    this.$node.append(node);
  }

  getNode() {
    return this.$node[0];
  }

  _setFullScreenStatus(isFullscreen) {
    this.$node.toggleClass(styles.fullscreen, isFullscreen);
  }

  enterFullScreen() {
    fullscreen.request(this.$node[0]);
    this._setFullScreenStatus(true);
  }

  exitFullScreen() {
    fullscreen.exit();
    this._setFullScreenStatus(false);
  }

  destroy() {
    this.$node.remove();

    delete this.$node;
  }
}
