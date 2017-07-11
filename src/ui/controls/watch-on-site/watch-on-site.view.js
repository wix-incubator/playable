import $ from 'jbone';

import View from '../../core/view';

import styles from './watch-on-site.scss';


class WatchOnSiteView extends View {
  constructor(config) {
    super(config);
    const { callbacks } = config;

    this._callbacks = callbacks;

    this.$node = $('<div>', {
      class: `${this.styleNames.wrapper} ${this.styleNames.icon}`
    });

    if (config.logo) {
      const $logo = $('<img>', {
        src: config.logo
      });

      this.$node.append($logo);
    } else {
      const $toggle = $('<div>', {
        class: this.styleNames['watch-on-site-toggle']
      });

      this.$node.append($toggle);
    }

    this._bindCallbacks();
    this._bindEvents();
  }

  _bindCallbacks() {
    this._onNodeClick = this._onNodeClick.bind(this);
  }

  _bindEvents() {
    this.$node[0].addEventListener('click', this._onNodeClick);
  }

  _unbindEvents() {
    this.$node[0].removeEventListener('click', this._onNodeClick);
  }

  _onNodeClick(e) {
    e.stopPropagation();
    this._callbacks.onWatchOnSiteClick();
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

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$wrapper;
    delete this.$controlsContainer;
    delete this.$node;
  }
}

WatchOnSiteView.extendStyleNames(styles);

export default WatchOnSiteView;
