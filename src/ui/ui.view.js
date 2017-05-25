import $ from 'jbone';

import fullscreen from '../utils/fullscreen';

import styles from './ui.scss';


export default class PlayerUIView {
  constructor({ width, height, callbacks }) {
    this._callbacks = callbacks;

    this.$node = $('<div>', {
      class: styles['video-wrapper']
    });

    this.$innerWrapper = $('<div>', {
      class: styles['inner-wrapper']
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

    this.$node.append(this.$innerWrapper);

    this._bindCallbacks();

    this._bindEvents();
  }

  _bindCallbacks() {
    this._proxyMouseEnterOnNode = this._proxyMouseEnterOnNode.bind(this);
    this._proxyMouseMoveOnNode = this._proxyMouseMoveOnNode.bind(this);
    this._proxyMouseLeaveOnNode = this._proxyMouseLeaveOnNode.bind(this);
    this._toggleClassOnFullScreenChange = this._toggleClassOnFullScreenChange.bind(this);
  }

  _bindEvents() {
    this.$node.on('mouseenter', this._proxyMouseEnterOnNode);
    this.$node.on('mousemove', this._proxyMouseMoveOnNode);
    this.$node.on('mouseleave', this._proxyMouseLeaveOnNode);

    document.addEventListener(fullscreen.raw.fullscreenchange, this._toggleClassOnFullScreenChange);
  }

  _toggleClassOnFullScreenChange() {
    this._setFullScreenStatus(fullscreen.isFullscreen);
    this._callbacks.onFullScreenStatusChange();
  }

  _proxyMouseEnterOnNode() {
    this._callbacks.onMouseEnter();
  }

  _proxyMouseMoveOnNode() {
    this._callbacks.onMouseMove();
  }

  _proxyMouseLeaveOnNode() {
    this._callbacks.onMouseLeave();
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
    this.$innerWrapper.append(node);
  }

  getNode() {
    return this.$node[0];
  }

  _setFullScreenStatus(isFullscreen) {
    this.$innerWrapper.toggleClass(styles.fullscreen, isFullscreen);
  }

  enterFullScreen() {
    fullscreen.request(this.$innerWrapper[0]);
    this._setFullScreenStatus(true);
  }

  exitFullScreen() {
    fullscreen.exit();
    this._setFullScreenStatus(false);
  }

  isInFullScreen() {
    return fullscreen.isFullscreen();
  }

  _unbindEvents() {
    document.removeEventListener(fullscreen.raw.fullscreenchange, this._toggleClassOnFullScreenChange);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}
