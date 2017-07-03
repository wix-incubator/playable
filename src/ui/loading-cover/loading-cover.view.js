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
      class: this.styleNames.image
    });

    this._showImageOnLoad = this._showImageOnLoad.bind(this);

    this.$image.on('load', this._showImageOnLoad);

    this.setCover(config.url);

    this.$node.append(this.$image);
  }

  getNode() {
    return this.$node[0];
  }

  _showImageOnLoad() {
    this.$image.removeClass(this.styleNames.hidden);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  setCover(url) {
    this.$image.addClass(this.styleNames.hidden);
    this.$image.attr('src', url);
  }

  destroy() {
    this.$image.off('load', this._showImageOnLoad);
    this.$node.remove();

    delete this.$node;
  }
}

LoadingCoverView.extendStyleNames(styles);

export default LoadingCoverView;
