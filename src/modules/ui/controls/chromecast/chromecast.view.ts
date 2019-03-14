import { TEXT_LABELS } from '../../../../constants';

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
          label: this._textMap.get(TEXT_LABELS.START_CHROMECAST_BUTTON_LABEL), //TODO: depends on state
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
        text: this._textMap.get(TEXT_LABELS.START_CHROMECAST_BUTTON_TOOLTIP), //TODO: depends on state
      },
    );

    this._bindEvents();
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
    this._callbacks = null;

    this._tooltipReference.destroy();
    this._tooltipReference = null;

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$downloadButton = null;
    this._$rootElement = null;

    this._textMap = null;
  }
}

ChromecastView.setTheme(downloadViewTheme);
ChromecastView.extendStyleNames(styles);

export default ChromecastView;
