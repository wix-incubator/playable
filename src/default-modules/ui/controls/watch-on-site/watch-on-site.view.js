import $ from 'jbone';

import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import styles from './watch-on-site.scss';
import watchOnSiteIcon from '../../../../assets/view-on-site.svg';


class WatchOnSiteView extends View {
  constructor(config) {
    super(config);
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;

    this.$node = $('<div>', {
      class: `${this.styleNames.wrapper}`
    });

    this.$logo = $('<img>', {
      class: this.styleNames['watch-on-site-toggle'],
      'aria-label': this._texts.get(TEXT_LABELS.WATCH_ON_SITE_LABEL),
      role: 'button',
      tabIndex: 0,
      src: config.logo || watchOnSiteIcon
    });

    this.$tooltip = $('<div>', {
      class: `${this.styleNames.tooltip}`
    });
    this.$tooltip.html(this._texts.get(TEXT_LABELS.WATCH_ON_SITE_TOOLTIP));
    this.$node.append(this.$tooltip);

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
    this.$logo[0].addEventListener('click', this._onNodeClick);
  }

  _unbindEvents() {
    this.$logo[0].removeEventListener('click', this._onNodeClick);
  }

  _onNodeClick() {
    this.$logo[0].focus();
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

    delete this._texts;
  }
}

WatchOnSiteView.extendStyleNames(styles);

export default WatchOnSiteView;
