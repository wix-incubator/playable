import View from '../../core/view';
import { IView } from '../../core/types';

import { ITooltipReference } from '../../core/tooltip/types';
import { buttonTemplate } from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import { ITextMap } from '../../../text-map/types';

import {
  IChromecaststStyles,
  IChromecaststViewCallbacks,
  IChromecaststViewConfig,
} from './types';

import downloadViewTheme from './chromecast.theme';
import styles from './chromecast.scss';

enum TEXT_LABELS {
  START_CHROMECAST_BUTTON_LABEL = 'start-chromecast-button-label',
  START_CHROMECAST_BUTTON_TOOLTIP = 'start-chromecast-button-tooltip',
  STOP_CHROMECAST_BUTTON_LABEL = 'stop-chromecast-button-label',
  STOP_CHROMECAST_BUTTON_TOOLTIP = 'stop-chromecast-button-tooltip',
}

const DEFAULT_TEXTS = {
  [TEXT_LABELS.START_CHROMECAST_BUTTON_LABEL]: 'Broadcast video',
  [TEXT_LABELS.START_CHROMECAST_BUTTON_TOOLTIP]: 'Broadcast Video',
  [TEXT_LABELS.STOP_CHROMECAST_BUTTON_LABEL]: 'Stop broadcasting video',
  [TEXT_LABELS.STOP_CHROMECAST_BUTTON_TOOLTIP]: 'Stop Broadcasting video',
};

class ChromecastView extends View<IChromecaststStyles>
  implements IView<IChromecaststStyles> {
  private _callbacks: IChromecaststViewCallbacks;
  private _textMap: ITextMap;
  private _tooltipReference: ITooltipReference;

  private _$rootElement: HTMLElement;
  private _$downloadButton: HTMLElement;

  constructor(config: IChromecaststViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;
    this._textMap = textMap;

    this._$rootElement = htmlToElement(
      buttonTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {
          label: this._getLabelText(TEXT_LABELS.START_CHROMECAST_BUTTON_LABEL),
        },
      }),
    );

    this._$downloadButton = getElementByHook(
      this._$rootElement,
      'chromecast-button',
    );

    this._tooltipReference = tooltipService.createReference(
      this._$downloadButton,
      {
        text: this._getLabelText(TEXT_LABELS.START_CHROMECAST_BUTTON_TOOLTIP),
      },
    );

    this._bindEvents();
  }

  private _getLabelText(label: TEXT_LABELS) {
    return this._textMap.get(label, null, DEFAULT_TEXTS[label]);
  }

  private _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._$downloadButton.addEventListener('click', this._onButtonClick);
  }

  private _unbindEvents() {
    this._$downloadButton.removeEventListener('click', this._onButtonClick);
  }

  private _onButtonClick() {
    this._$rootElement.focus();
    this._callbacks.onButtonClick();
  }

  setCastingState(isCasting: boolean) {
    if (isCasting) {
      this._$rootElement.setAttribute(
        'aria-label',
        this._getLabelText(TEXT_LABELS.STOP_CHROMECAST_BUTTON_LABEL),
      );

      this._tooltipReference.setText(
        this._getLabelText(TEXT_LABELS.STOP_CHROMECAST_BUTTON_TOOLTIP),
      );
    } else {
      this._$rootElement.setAttribute(
        'aria-label',
        this._getLabelText(TEXT_LABELS.START_CHROMECAST_BUTTON_LABEL),
      );

      this._tooltipReference.setText(
        this._getLabelText(TEXT_LABELS.START_CHROMECAST_BUTTON_TOOLTIP),
      );
    }
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  getElement() {
    return this._$rootElement;
  }

  destroy() {
    this._unbindEvents();
    this._tooltipReference.destroy();

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }
  }
}

ChromecastView.setTheme(downloadViewTheme);
ChromecastView.extendStyleNames(styles);

export default ChromecastView;
