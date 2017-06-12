import $ from 'jbone';

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
  }

  _bindEvents() {
    this.$node[0].addEventListener('mouseenter', this._proxyMouseEnterOnNode);
    this.$node[0].addEventListener('mousemove', this._proxyMouseMoveOnNode);
    this.$node[0].addEventListener('mouseleave', this._proxyMouseLeaveOnNode);
  }

  _unbindEvents() {
    this.$node[0].removeEventListener('mouseenter', this._proxyMouseEnterOnNode);
    this.$node[0].removeEventListener('mousemove', this._proxyMouseMoveOnNode);
    this.$node[0].removeEventListener('mouseleave', this._proxyMouseLeaveOnNode);
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

  setFullScreenStatus(isFullScreen) {
    this.$node.toggleClass(styles.fullscreen, isFullScreen);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}
