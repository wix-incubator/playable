import { TEXT_LABELS } from '../../../../constants';

import { ITooltipReference } from '../../core/tooltip/types';
import View from '../../core/view';
import { IView } from '../../core/types';
import { ILogoViewStyles, ILogoViewCallbacks, ILogoViewConfig } from './types';
import { logoTemplate } from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import { ITextMap } from '../../../text-map/types';

import logoViewTheme from './logo.theme';

import styles from './logo.scss';

class LogoView extends View<ILogoViewStyles> implements IView<ILogoViewStyles> {
  private _tooltipReference: ITooltipReference;
  private _callbacks: ILogoViewCallbacks;
  private _textMap: ITextMap;

  private _$rootElement: HTMLElement;
  private _$logo: HTMLElement;
  private _$placeholder: HTMLElement;

  constructor(config: ILogoViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;
    this._textMap = textMap;

    this._$rootElement = htmlToElement(
      logoTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {
          label: this._textMap.get(TEXT_LABELS.LOGO_LABEL),
        },
      }),
    );

    this._$logo = getElementByHook(this._$rootElement, 'company-logo');
    this._$placeholder = getElementByHook(
      this._$rootElement,
      'logo-placeholder',
    );

    this._tooltipReference = tooltipService.createReference(
      this._$rootElement,
      {
        text: this._textMap.get(TEXT_LABELS.LOGO_TOOLTIP),
      },
    );

    this.setLogo(config.logo);

    this._bindCallbacks();
    this._bindEvents();
  }

  setLogo(url: string) {
    if (url) {
      this._$logo.classList.remove(this.styleNames.hidden);
      this._$placeholder.classList.add(this.styleNames.hidden);
      this._$logo.setAttribute('src', url);
    } else {
      this._$logo.classList.add(this.styleNames.hidden);
      this._$placeholder.classList.remove(this.styleNames.hidden);
      this._$logo.removeAttribute('src');
    }
  }

  setDisplayAsLink(flag: boolean) {
    if (flag) {
      this._$rootElement.classList.add(this.styleNames.link);
      this._tooltipReference.enable();
    } else {
      this._$rootElement.classList.remove(this.styleNames.link);
      this._tooltipReference.disable();
    }
  }

  private _bindCallbacks() {
    this._onNodeClick = this._onNodeClick.bind(this);
  }

  private _bindEvents() {
    this._$rootElement.addEventListener('click', this._onNodeClick);
  }

  private _unbindEvents() {
    this._$rootElement.removeEventListener('click', this._onNodeClick);
  }

  private _onNodeClick() {
    this._$rootElement.focus();
    this._callbacks.onLogoClick();
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
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
    this._$logo = null;
    this._$placeholder = null;

    this._tooltipReference = null;
    this._textMap = null;
  }
}

LogoView.setTheme(logoViewTheme);
LogoView.extendStyleNames(styles);

export default LogoView;
