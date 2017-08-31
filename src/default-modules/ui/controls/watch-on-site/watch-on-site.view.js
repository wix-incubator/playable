import $ from 'jbone';

import View from '../../core/view';

import styles from './watch-on-site.scss';
import watchOnSiteIcon from '../../../../assets/view-on-site.svg';


class WatchOnSiteView extends View {
  constructor(config) {
    super(config);
    const { callbacks, tooltip } = config;

    this._callbacks = callbacks;

    this.$node = $('<div>', {
      class: `${this.styleNames.wrapper}`
    });

    this.$logo = $('<img>', {
      class: this.styleNames['watch-on-site-toggle'],
      src: config.logo || watchOnSiteIcon
    });

    if (tooltip) {
      this.$tooltip = $('<div>', {
        class: `${this.styleNames.tooltip}`
      });
      this.$tooltip.html(tooltip);
      this.$node.append(this.$tooltip);
    }

    this.$node.append(this.$logo);

    this.setLogo(config.logo);

    this._bindCallbacks();
    this._bindEvents();
  }

  setLogo(url) {
    if (url) {
      this.$logo.removeClass(this.styleNames['watch-on-site-toggle']);
      this.$logo.addClass(this.styleNames['company-logo']);
      this.$logo.attr('src', url);
    } else {
      this.$logo.removeClass(this.styleNames['company-logo']);
      this.$logo.addClass(this.styleNames['watch-on-site-toggle']);
      this.$logo.attr('src', watchOnSiteIcon);
    }
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
