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

  _initDOM() {
    const styles = this.styleNames;
    const texts = {
      text: this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_TEXT),
      label: this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_LABEL),
      tooltip: this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_TOOLTIP),
    };

    this.$liveIndicator = $('<span>')
      .addClass(styles['live-indicator'])
      .attr('aria-label', texts.label)
      .html(texts.text);

    this.$tooltip = $('<div>')
      .addClass(styles.tooltip)
      .html(texts.tooltip);

    // NOTE: LIVE indicator is hidden by default
    this.$node = $('<div>')
      .addClass(classNames(styles.wrapper, styles.hidden))
      .append(this.$liveIndicator)
      .append(this.$tooltip);
  }

  _bindEvents() {
    this.$liveIndicator[0].addEventListener('click', this._callbacks.onClick);
  }

  _unbindEvents() {
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
