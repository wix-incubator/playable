import * as $ from 'jbone';

import View from '../core/view';

import * as styles from './loader.scss';

class LoaderView extends View {
  $node;

  constructor(config?) {
    super(config);

    this.$node = $('<div>', {
      class: this.styleNames.loader,
      'data-hook': 'loader',
    });
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

  destroy() {
    this.$node.remove();

    delete this.$node;
  }
}

LoaderView.extendStyleNames(styles);

export default LoaderView;
