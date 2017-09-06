import $ from 'jbone';

import View from '../ui/core/view';

import styles from './root-container.scss';
import globalStyles from './root-container.global.scss';


class RootContainerView extends View {
  constructor(config) {
    super(config);
    const { width, height, callbacks, fillAllSpace } = config;

    this._callbacks = callbacks;
    this.$node = $('<div>', {
      'data-hook': 'player-container',
      tabIndex: 0,
      class: this.styleNames['video-wrapper']
    });

    this.setFillAllSpaceFlag(fillAllSpace);

    this.setWidth(width);
    this.setHeight(height);
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
    this.$node.append(node);
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

  setFillAllSpaceFlag(isFillAllSpace = false) {
    this.$node.toggleClass(this.styleNames['fill-all-space'], isFillAllSpace);
  }

  destroy() {
    this.$node.remove();

    delete this.$node;
  }
}

RootContainerView.extendStyleNames(styles);
RootContainerView.extendStyleNames(globalStyles);

export default RootContainerView;
