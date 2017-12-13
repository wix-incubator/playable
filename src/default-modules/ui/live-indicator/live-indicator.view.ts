import * as $ from 'jbone';
import * as classNames from 'classnames';

import View from '../core/view';

import * as styles from './live-indicator.scss';
import { TEXT_LABELS } from '../../../constants';

class LiveIndicatorView extends View {
  private _callbacks;
  private _textMap;

  $node;
  $liveIndicator;
  $tooltip;

  constructor(config) {
    super(config);

    this._callbacks = config.callbacks;
    this._textMap = config.textMap;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this.$liveIndicator = $('<span>', {
      class: this.styleNames['live-indicator'],
      'aria-label': this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_LABEL),
    }).html(this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_TEXT));

    this.$tooltip = $('<div>', {
      class: this.styleNames.tooltip,
    }).html(this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_TOOLTIP));

    // NOTE: LIVE indicator is hidden by default
    this.$node = $('<div>', {
      class: classNames(this.styleNames.wrapper, this.styleNames.hidden),
    })
      .append(this.$liveIndicator)
      .append(this.$tooltip);
  }

  private _bindEvents() {
    this.$liveIndicator[0].addEventListener('click', this._callbacks.onClick);
  }

  private _unbindEvents() {
    this.$liveIndicator[0].removeEventListener(
      'click',
      this._callbacks.onClick,
    );
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
