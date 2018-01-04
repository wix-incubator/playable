import * as $ from 'jbone';
import * as classnames from 'classnames';
import View from '../core/view';

import * as styles from './overlay.scss';

class OverlayView extends View {
  private _callbacks;

  $node;
  $content;
  $playButton;

  constructor(config) {
    super();
    const { callbacks, src } = config;

    this._callbacks = callbacks;

    this.$node = $('<div>', {
      class: classnames(this.styleNames.active, this.styleNames.overlay),
      'data-hook': 'overlay',
    });

    this.$content = $('<div>', {
      class: this.styleNames.poster,
    });

    this.setPoster(src);

    this.$playButton = $('<div>', {
      class: this.styleNames.icon,
    });

    this.$node.append(this.$content).append(this.$playButton);

    this._bindEvents();
  }

  _bindEvents() {
    this.$playButton[0].addEventListener('click', this._callbacks.onPlayClick);
  }

  getNode() {
    return this.$node[0];
  }

  hideContent() {
    this.$node.removeClass(this.styleNames.active);
  }

  showContent() {
    this.$node.addClass(this.styleNames.active);
  }

  hide() {
    this.$node.addClass(this.styleNames.hidden);
  }

  show() {
    this.$node.removeClass(this.styleNames.hidden);
  }

  setPoster(src) {
    if (src) {
      this.$content.css('background-image', `url('${src}')`);
    }
  }

  _unbindEvents() {
    this.$playButton[0].removeEventListener(
      'click',
      this._callbacks.onPlayClick,
    );
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
