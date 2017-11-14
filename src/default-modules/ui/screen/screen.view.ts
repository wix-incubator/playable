import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './screen.scss';


class ScreenView extends View {
  private _nativeControls;
  private _callbacks;

  $node;
  $topBackground;
  $bottomBackground;

  constructor(config) {
    super(config);
    const { callbacks, nativeControls, playbackViewNode } = config;

    this._nativeControls = nativeControls;
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['screen-block'],
      'data-hook': 'screen-block'
    });

    this._bindEvents();

    this.$topBackground = $('<div>', {
      class: this.styleNames['top-gradient-background']
    });

    this.$bottomBackground = $('<div>', {
      class: this.styleNames['bottom-gradient-background']
    });

    if (this._nativeControls) {
      playbackViewNode.setAttribute('controls', 'true');
    }

    playbackViewNode.setAttribute('tabindex', -1);

    this.$node
      .append(playbackViewNode)
      .append(this.$topBackground)
      .append(this.$bottomBackground);
  }

  _bindEvents() {
    this.$node[0].addEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].addEventListener('dblclick', this._callbacks.onWrapperMouseDblClick);
  }

  _unbindEvents() {
    this.$node[0].removeEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].removeEventListener('dblclick', this._callbacks.onWrapperMouseDblClick);
  }

  focusOnNode() {
    this.$node[0].focus();
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

  showTopShadow() {
    this.$topBackground.addClass(this.styleNames.visible);
  }

  hideTopShadow() {
    this.$topBackground.removeClass(this.styleNames.visible);
  }

  showBottomShadow() {
    if (!this._nativeControls) {
      this.$bottomBackground.addClass(this.styleNames.visible);
    }
  }

  hideBottomShadow() {
    this.$bottomBackground.removeClass(this.styleNames.visible);
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

ScreenView.extendStyleNames(styles);

export default ScreenView;
