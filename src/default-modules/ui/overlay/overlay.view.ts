import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './overlay.scss';

class OverlayView extends View {
  private _callbacks;

  $node;
  $content;
  $playButton;

  constructor(config) {
    super(config);
    const { callbacks, src } = config;

    this._callbacks = callbacks;

    this.$node = $('<div>', {
      class: this.styleNames.overlay,
      'data-hook': 'overlay',
    });

    this.$content = $('<div>', {
      class: this.styleNames.poster,
    });

    this.setBackgroundSrc(src);

    this.$playButton = $('<div>', {
      class: this.styleNames.icon,
    });

    this.$node
      .append(this.$content)
      .append(this.$playButton);

    this._bindEvents();
  }

  _bindEvents() {
    this.$playButton[0].addEventListener('click', this._callbacks.onPlayClick);
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
    if (src) {
      this.$content.css('background-image', `url('${src}')`);
    }
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

OverlayView.extendStyleNames(styles);

export default OverlayView;
