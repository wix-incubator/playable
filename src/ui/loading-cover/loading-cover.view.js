import $ from 'jbone';

import View from '../core/view';

import styles from './loading-cover.scss';


class LoadingCoverView extends View {
  constructor(config) {
    super(config);

    this.$node = $('<div>', {
      class: this.styleNames['loading-cover'],
      'data-hook': 'loading-cover'
    });

    this.$image = $('<img>', {
      class: this.styleNames.image,
      src: config.url
    });

    this.showImageOnLoad = this.showImageOnLoad.bind(this);

    this.$image.addClass(this.styleNames.hidden);
    this.$image.on('load', this.showImageOnLoad);

    this.$node.append(this.$image);
  }

  getNode() {
    return this.$node[0];
  }

  showImageOnLoad() {
    this.$image.removeClass(this.styleNames.hidden);
  }

  hide() {
    this.$node.addClass(this.styleNames.hidden);
  }

  show() {
    this.$node.removeClass(this.styleNames.hidden);
  }

  destroy() {
    this.$image.off('load', this.showImageOnLoad);
    this.$node.remove();

    delete this.$node;
  }
}

LoadingCoverView.extendStyleNames(styles);

export default LoadingCoverView;
