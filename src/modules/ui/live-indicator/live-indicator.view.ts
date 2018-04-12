import { ITooltipReference, ITooltipService } from '../core/tooltip';
import { IView } from '../core/types';
import View from '../core/view';

import { liveIndicatorTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleNodeClass from '../core/toggleNodeClass';

import {
  ILiveIndicatorViewStyles,
  ILiveIndicatorViewCallbacks,
  ILiveIndicatorViewConfig,
} from './types';

import styles from './live-indicator.scss';

import { TEXT_LABELS } from '../../../constants';

class LiveIndicatorView extends View<ILiveIndicatorViewStyles>
  implements IView<ILiveIndicatorViewStyles> {
  private _callbacks: ILiveIndicatorViewCallbacks;
  private _textMap;
  private _tooltipService: ITooltipService;
  private _tooltipReference: ITooltipReference;

  private _$node: HTMLElement;
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
    this._$node = htmlToElement(
      liveIndicatorTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {},
      }),
    );

    this._$liveIndicatorText = getElementByHook(
      this._$node,
      'live-indicator-text',
    );

    this._tooltipReference = this._tooltipService.createReference(this._$node, {
      text: this._textMap.get(TEXT_LABELS.LIVE_SYNC_TOOLTIP),
    });

    // NOTE: LIVE indicator is hidden and inactive by default
    this.toggle(false);
    this.toggleActive(false);
    this.toggleEnded(false);
  }

  private _bindEvents() {
    this._$node.addEventListener('click', this._callbacks.onClick);
  }

  private _unbindEvents() {
    this._$node.removeEventListener('click', this._callbacks.onClick);
  }

  toggleActive(shouldActivate: boolean) {
    toggleNodeClass(this._$node, this.styleNames.active, shouldActivate);
  }

  toggleEnded(isEnded: boolean) {
    toggleNodeClass(this._$node, this.styleNames.ended, isEnded);

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
    toggleNodeClass(this._$node, this.styleNames.hidden, !shouldShow);
  }

  getNode() {
    return this._$node;
  }

  destroy() {
    this._unbindEvents();
    this._tooltipReference.destroy();

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
    delete this._$liveIndicatorText;
    delete this._callbacks;
    delete this._textMap;
  }
}

LiveIndicatorView.extendStyleNames(styles);

export default LiveIndicatorView;
