import { ITooltipReference, ITooltipService } from '../core/tooltip/types';
import { IView } from '../core/types';
import View from '../core/view';

import { liveIndicatorTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleElementClass from '../core/toggleElementClass';

import {
  ILiveIndicatorViewStyles,
  ILiveIndicatorViewCallbacks,
  ILiveIndicatorViewConfig,
} from './types';
import { ITextMap } from '../../text-map/types';

import styles from './live-indicator.scss';

import { TEXT_LABELS } from '../../../constants';

class LiveIndicatorView extends View<ILiveIndicatorViewStyles>
  implements IView<ILiveIndicatorViewStyles> {
  private _callbacks: ILiveIndicatorViewCallbacks;
  private _textMap: ITextMap;
  private _tooltipService: ITooltipService;
  private _tooltipReference: ITooltipReference;

  private _$rootElement: HTMLElement;
  private _$liveIndicatorText: HTMLElement;

  constructor(config: ILiveIndicatorViewConfig) {
    super();

    this._callbacks = config.callbacks;
    this._textMap = config.textMap;
    this._tooltipService = config.tooltipService;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      liveIndicatorTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {},
      }),
    );

    this._$liveIndicatorText = getElementByHook(
      this._$rootElement,
      'playable-live-indicator-text',
    );

    this._tooltipReference = this._tooltipService.createReference(
      this._$rootElement,
      {
        text: this._textMap.get(TEXT_LABELS.LIVE_SYNC_TOOLTIP),
      },
    );

    // NOTE: LIVE indicator is hidden and inactive by default
    this.toggle(false);
    this.toggleActive(false);
    this.toggleEnded(false);
  }

  private _bindEvents() {
    this._$rootElement.addEventListener('click', this._callbacks.onClick);
  }

  private _unbindEvents() {
    this._$rootElement.removeEventListener('click', this._callbacks.onClick);
  }

  toggleActive(shouldActivate: boolean) {
    toggleElementClass(
      this._$rootElement,
      this.styleNames.active,
      shouldActivate,
    );

    // NOTE: disable tooltip while video is sync with live
    if (shouldActivate) {
      this._tooltipReference.disable();
    } else {
      this._tooltipReference.enable();
    }
  }

  toggleEnded(isEnded: boolean) {
    toggleElementClass(this._$rootElement, this.styleNames.ended, isEnded);

    this._$liveIndicatorText.innerText = this._textMap.get(
      TEXT_LABELS.LIVE_INDICATOR_TEXT,
      { isEnded },
    );
    this._$liveIndicatorText.setAttribute(
      'aria-label',
      !isEnded ? this._textMap.get(TEXT_LABELS.LIVE_SYNC_LABEL) : '',
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
    toggleElementClass(this._$rootElement, this.styleNames.hidden, !shouldShow);
  }

  getNode() {
    return this._$rootElement;
  }

  destroy() {
    this._unbindEvents();
    this._callbacks = null;

    this._tooltipReference.destroy();
    this._tooltipReference = null;

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
    this._$liveIndicatorText = null;
    this._callbacks = null;
    this._textMap = null;
  }
}

LiveIndicatorView.extendStyleNames(styles);

export default LiveIndicatorView;
