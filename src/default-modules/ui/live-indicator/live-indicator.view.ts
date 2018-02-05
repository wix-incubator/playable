import * as $ from 'jbone';
import * as classNames from 'classnames';

import { ITooltipReference, ITooltipService } from '../core/tooltip';
import { IView } from '../core/types';
import View from '../core/view';

import {
  ILiveIndicatorViewStyles,
  ILiveIndicatorViewCallbacks,
  ILiveIndicatorViewConfig,
} from './types';

import * as styles from './live-indicator.scss';
import { TEXT_LABELS } from '../../../constants';

class LiveIndicatorView extends View<ILiveIndicatorViewStyles>
  implements IView<ILiveIndicatorViewStyles> {
  private _callbacks: ILiveIndicatorViewCallbacks;
  private _textMap;
  private _tooltipService: ITooltipService;
  private _tooltipReference: ITooltipReference;

  private _$node;
  private _$liveIndicator;

  constructor(config: ILiveIndicatorViewConfig) {
    super();

    this._callbacks = config.callbacks;
    this._textMap = config.textMap;
    this._tooltipService = config.tooltipService;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$liveIndicator = $('<span>', {
      class: this.styleNames.liveIndicator,
      'aria-label': this._textMap.get(TEXT_LABELS.LIVE_SYNC_LABEL),
    }).html(this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_TEXT, {}));

    // NOTE: LIVE indicator is hidden by default
    this._$node = $('<div>', {
      class: classNames(
        this.styleNames.liveIndicatorWrapper,
        this.styleNames.hidden,
      ),
    }).append(this._$liveIndicator);

    this._tooltipReference = this._tooltipService.createReference(
      this._$node[0],
      {
        text: this._textMap.get(TEXT_LABELS.LIVE_SYNC_TOOLTIP),
      },
    );
  }

  private _bindEvents() {
    this._$node[0].addEventListener('click', this._callbacks.onClick);
  }

  private _unbindEvents() {
    this._$node[0].removeEventListener('click', this._callbacks.onClick);
  }

  toggleActive(shouldActivate: boolean) {
    this._$node.toggleClass(this.styleNames.active, shouldActivate);
  }

  toggleEnded(isEnded: boolean) {
    this._$node.toggleClass(this.styleNames.ended, isEnded);

    this._$liveIndicator.html(
      this._textMap.get(TEXT_LABELS.LIVE_INDICATOR_TEXT, { isEnded }),
    );

    if (isEnded) {
      this._tooltipReference.disable();
    } else {
      this._tooltipReference.enable();
    }
  }

  show() {
    this.toggle(true);
  }

  hide() {
    this.toggle(false);
  }

  toggle(shouldShow: boolean) {
    this._$node.toggleClass(this.styleNames.hidden, !shouldShow);
  }

  getNode() {
    return this._$node[0];
  }

  destroy() {
    this._unbindEvents();
    this._tooltipReference.destroy();
    this._$node.remove();

    delete this._$node;
    delete this._$liveIndicator;
    delete this._callbacks;
    delete this._textMap;
  }
}

LiveIndicatorView.extendStyleNames(styles);

export default LiveIndicatorView;
