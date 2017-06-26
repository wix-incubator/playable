import $ from 'jbone';

import View from './core/view';

import styles from './ui.scss';

class PlayerUIView extends View {
  constructor(config) {
    super(config);
    const { rootNode, width, height, callbacks } = config;

    this._callbacks = callbacks;
    this.$node = $(rootNode);
    this.$node.addClass(this.styleNames['video-wrapper']);
    this.$node.attr('data-hook', 'player-container');

    this.$innerWrapper = $('<div>', {
      class: this.styleNames['inner-wrapper']
    });

    this.setWidth(width);
    this.setHeight(height);

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

    this._width = width;

    this.$node
      .css({
        width: `${this._width}px`
      });
  }

  setHeight(height) {
    if (!height) {
      return;
    }

    this._height = height;

    this.$node
      .css({
        height: `${this._height}px`
      });
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  appendComponentNode(node) {
    this.$innerWrapper.append(node);
  }

  getNode() {
    return this.$node[0];
  }

  setFullScreenStatus(isFullScreen) {
    if (isFullScreen) {
      this.$node.attr('data-in-full-screen', true);
    } else {
      this.$node.removeAttr('data-in-full-screen');
    }
    this.$node.toggleClass(this.styleNames['full-screen'], isFullScreen);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}

PlayerUIView.extendStyleNames(styles);

export default PlayerUIView;
