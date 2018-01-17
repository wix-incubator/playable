import * as $ from 'jbone';

import { TEXT_LABELS } from '../../../../constants/index';

import { ITooltipService, ITooltipReference } from '../../core/tooltip';
import View from '../../core/view';

import * as styles from './logo.scss';
import * as viewOnSiteIcon from '../../../../assets/view-on-site.svg';

type ILogoViewConfig = {
  callbacks: { onLogoClick: Function };
  textMap: any;
  tooltipService: ITooltipService;
  logo?: string;
};

class LogoView extends View {
  private _tooltipReference: ITooltipReference;
  private _callbacks;
  private _textMap;

  $node;
  $logo;

  constructor(config: ILogoViewConfig) {
    super();
    const { callbacks, textMap, tooltipService } = config;

    this._callbacks = callbacks;
    this._textMap = textMap;

    this.$node = $('<div>', {
      class: this.styleNames.wrapper,
    });

    this.$logo = $('<img>', {
      class: this.styleNames['default-logo'],
      'aria-label': this._textMap.get(TEXT_LABELS.LOGO_LABEL),
      role: 'button',
      tabIndex: 0,
    });

    this._tooltipReference = tooltipService.createReference(this.$logo[0], {
      title: this._textMap.get(TEXT_LABELS.LOGO_TOOLTIP),
    });

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
    this._tooltipReference.destroy();
    this.$node.remove();

    delete this.$node;

    delete this._tooltipReference;
    delete this._textMap;
  }
}

LogoView.extendStyleNames(styles);

export default LogoView;
