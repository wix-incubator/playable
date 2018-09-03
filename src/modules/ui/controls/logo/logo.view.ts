import { TEXT_LABELS } from '../../../../constants';

import { ITooltipReference } from '../../core/tooltip/types';
import View from '../../core/view';
import { IView } from '../../core/types';
import { ILogoViewStyles, ILogoViewCallbacks, ILogoViewConfig } from './types';
import {
  logoTemplate,
  logoButtonTemplate,
  logoImageTemplate,
  logoInputTemplate,
} from './templates';

import htmlToElement from '../../core/htmlToElement';

import { ITextMap } from '../../../text-map/types';

import logoViewTheme from './logo.theme';

import styles from './logo.scss';

class LogoView extends View<ILogoViewStyles> implements IView<ILogoViewStyles> {
  private _tooltipReference: ITooltipReference;
  private _callbacks: ILogoViewCallbacks;
  private _textMap: ITextMap;

  private _$rootElement: HTMLElement;
  private _$logoImage: HTMLImageElement;
  private _$logoInput: HTMLInputElement;
  private _$logoButton: HTMLButtonElement;

  constructor(config: ILogoViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;
    this._textMap = textMap;

    this._$rootElement = htmlToElement(
      logoTemplate({
        styles: this.styleNames,
        texts: {
          label: this._textMap.get(TEXT_LABELS.LOGO_LABEL),
        },
      }),
    );

    this._$logoImage = htmlToElement(
      logoImageTemplate({
        styles: this.styleNames,
        texts: {
          label: this._textMap.get(TEXT_LABELS.LOGO_LABEL),
        },
      }),
    ) as HTMLImageElement;
    this._$logoInput = htmlToElement(
      logoInputTemplate({
        styles: this.styleNames,
        texts: {
          label: this._textMap.get(TEXT_LABELS.LOGO_LABEL),
        },
      }),
    ) as HTMLInputElement;
    this._$logoButton = htmlToElement(
      logoButtonTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {
          label: this._textMap.get(TEXT_LABELS.LOGO_LABEL),
        },
      }),
    ) as HTMLButtonElement;

    this._tooltipReference = tooltipService.createReference(
      this._$rootElement,
      {
        text: this._textMap.get(TEXT_LABELS.LOGO_TOOLTIP),
      },
    );

    this.setLogo(config.logo);

    this._bindCallbacks();
    this._bindEvents();

    this.showAsButton();
  }

  setLogo(url: string) {
    if (url) {
      this._$logoImage.setAttribute('src', url);
      this._$logoInput.setAttribute('src', url);
    } else {
      this._$logoImage.removeAttribute('src');
      this._$logoInput.removeAttribute('src');
    }
  }

  showAsImage() {
    this._setChild(this._$logoImage);

    this._tooltipReference.disable();
  }

  showAsButton() {
    this._setChild(this._$logoButton);

    this._tooltipReference.enable();
  }

  showAsInput() {
    this._setChild(this._$logoInput);

    this._tooltipReference.enable();
  }

  private _setChild(childNode: HTMLElement) {
    this._$rootElement.firstChild &&
      this._$rootElement.removeChild(this._$rootElement.firstChild);
    this._$rootElement.appendChild(childNode);
  }

  private _bindCallbacks() {
    this._onClick = this._onClick.bind(this);
  }

  private _bindEvents() {
    this._$rootElement.addEventListener('click', this._onClick);
  }

  private _unbindEvents() {
    this._$rootElement.removeEventListener('click', this._onClick);
  }

  private _onClick() {
    this._$rootElement.focus();
    this._callbacks.onLogoClick();
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide() {
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

    this._$rootElement = null;
    this._$logoImage = null;
    this._$logoInput = null;
    this._$logoButton = null;

    this._tooltipReference = null;
    this._textMap = null;
  }
}

LogoView.setTheme(logoViewTheme);
LogoView.extendStyleNames(styles);

export default LogoView;
