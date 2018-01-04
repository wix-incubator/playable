import * as $ from 'jbone';
import * as classnames from 'classnames';

import View from '../core/view';

import * as styles from './loader.scss';

class LoaderView extends View {
  $node;

  constructor() {
    super();

    this.$node = $('<div>', {
      class: classnames(this.styleNames.loader, this.styleNames.active),
      'data-hook': 'loader',
    });
  }

  getNode() {
    return this.$node[0];
  }

  showContent() {
    this.$node.addClass(this.styleNames.active);
  }

  hideContent() {
    this.$node.removeClass(this.styleNames.active);
  }

  hide() {
    this.$node.addClass(this.styleNames.hidden);
  }

  show() {
    this.$node.removeClass(this.styleNames.hidden);
  }

  destroy() {
    this.$node.remove();

    delete this.$node;
  }
}

LoaderView.extendStyleNames(styles);

export default LoaderView;
