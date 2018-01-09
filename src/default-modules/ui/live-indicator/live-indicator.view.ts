import * as $ from 'jbone';
import * as classNames from 'classnames';

import { ITooltip, ITooltipService } from '../core/tooltip';
import View from '../core/view';

import * as styles from './live-indicator.scss';
import { TEXT_LABELS } from '../../../constants';

type ILiveIndicatorViewConfig = {
  callbacks: { onClick: Function };
  textMap: any;
  tooltipService: ITooltipService;
};

class LiveIndicatorView extends View {
  private _callbacks;
  private _textMap;
  private _tooltipService: ITooltipService;
  private _tooltip: ITooltip;

  $node;
  $liveIndicator;
  $tooltip;

  constructor(config: ILiveIndicatorViewConfig) {
    super();

    this._callbacks = config.callbacks;
    this._textMap = config.textMap;
    this._tooltipService = config.tooltipService;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this.$liveIndicator = $('<span>', {
      class: this.styleNames['live-indicator'],
      'aria-label': this._textMap.get(TEXT_LABELS.LIVE_SYNC_LABEL),
    }).html(this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_TEXT));

    // NOTE: LIVE indicator is hidden by default
    this.$node = $('<div>', {
      class: classNames(this.styleNames.wrapper, this.styleNames.hidden),
    }).append(this.$liveIndicator);

    this._tooltip = this._tooltipService.create(this.$node[0], {
      title: this._textMap.get(TEXT_LABELS.LIVE_SYNC_TOOLTIP),
    });
  }

  private _bindEvents() {
    this.$node[0].addEventListener('click', this._callbacks.onClick);
  }

  private _unbindEvents() {
    this.$node[0].removeEventListener('click', this._callbacks.onClick);
  }

  toggleActive(shouldActivate: boolean) {
    this.$node.toggleClass(this.styleNames.active, shouldActivate);
  }

  show() {
    this.toggle(true);
  }

  hide() {
    this.toggle(false);
  }

  toggle(shouldShow: boolean) {
    this.$node.toggleClass(this.styleNames.hidden, !shouldShow);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this._tooltip.destroy();
    this.$node.remove();

    delete this.$node;
    delete this.$liveIndicator;
    delete this.$tooltip;
    delete this._callbacks;
    delete this._textMap;
  }
}

LiveIndicatorView.extendStyleNames(styles);

export default LiveIndicatorView;
