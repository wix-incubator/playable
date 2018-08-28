import { tooltipTemplate } from './templates';
import htmlToElement from '../htmlToElement';
import getElementByHook from '../getElementByHook';
import Stylable from '../stylable';

import { ITooltip, ITooltipStyles } from './types';

import styles from './tooltip.scss';

class Tooltip extends Stylable<ITooltipStyles> implements ITooltip {
  private _$rootElement: HTMLElement;
  private _$tooltipInner: HTMLElement;
  private _isHidden: boolean;

  constructor() {
    super();

    this._isHidden = true;
    this._initDOM();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      tooltipTemplate({
        styles: this.styleNames,
      }),
    );
    this._$tooltipInner = getElementByHook(this._$rootElement, 'tooltip-inner');
  }

  getElement(): HTMLElement {
    return this._$rootElement;
  }

  get isHidden(): boolean {
    return this._isHidden;
  }

  show() {
    if (!this._isHidden) {
      return;
    }
    this._isHidden = false;
    this._$rootElement.classList.add(this.styleNames.tooltipVisible);
  }

  hide() {
    if (this._isHidden) {
      return;
    }
    this._isHidden = true;
    this._$rootElement.classList.remove(this.styleNames.tooltipVisible);
  }

  setText(text: string) {
    this.clearElement();
    this._showAsText();
    this._$tooltipInner.innerText = text;
  }

  clearElement() {
    this._$tooltipInner.firstChild &&
      this._$tooltipInner.removeChild(this._$tooltipInner.firstChild);
  }

  setElement(element: HTMLElement) {
    if (element !== this._$tooltipInner.firstChild) {
      this._showAsElement();
      this.clearElement();
      if (element) {
        this._$tooltipInner.appendChild(element);
      }
    }
  }

  private _showAsText() {
    this._$rootElement.classList.remove(this.styleNames.showAsElement);
    this._$rootElement.classList.add(this.styleNames.showAsText);
  }

  private _showAsElement() {
    this._$rootElement.classList.remove(this.styleNames.showAsText);
    this._$rootElement.classList.add(this.styleNames.showAsElement);
  }

  setStyle(style: any) {
    Object.keys(style).forEach(styleKey => {
      (this._$rootElement.style as any)[styleKey] = style[styleKey];
    });
  }

  destroy() {
    this._$rootElement = null;
    this._$tooltipInner = null;
  }
}

Tooltip.extendStyleNames(styles);

export { ITooltip, ITooltipStyles };

export default Tooltip;
