import $ from 'jbone';

import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import styles from './logo.scss';
import viewOnSiteIcon from '../../../../assets/view-on-site.svg';


class LogoView extends View {
  constructor(config) {
    super(config);
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;

    this.$node = $('<div>', {
      class: `${this.styleNames.wrapper}`
    });

    this.$logo = $('<img>', {
      class: this.styleNames['default-logo'],
      'aria-label': this._texts.get(TEXT_LABELS.LOGO_LABEL),
      role: 'button',
      tabIndex: 0
    });

    this.$tooltip = $('<div>', {
      class: `${this.styleNames.tooltip}`
    });
    this.$tooltip.html(this._texts.get(TEXT_LABELS.LOGO_TOOLTIP));
    this.$node.append(this.$tooltip);

    this.$node.append(this.$logo);

    this.setLogo(config.logo);

    this._bindCallbacks();
    this._bindEvents();
  }

  setLogo(url) {
    if (url) {
      this.$logo.removeClass(this.styleNames['default-logo']);
      this.$logo.addClass(this.styleNames['company-logo']);
      this.$logo.attr('src', url);
    } else {
      this.$logo.removeClass(this.styleNames['company-logo']);
      this.$logo.addClass(this.styleNames['default-logo']);
      this.$logo.attr('src', viewOnSiteIcon);
    }
  }

  setDisplayAsLink(flag) {
    this.$node.toggleClass(this.styleNames.link, flag);
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
    this._callbacks.onLogoClick();
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

LogoView.extendStyleNames(styles);

export default LogoView;
