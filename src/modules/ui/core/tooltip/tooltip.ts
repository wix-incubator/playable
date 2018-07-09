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
    this._$tooltipInner = getElementByHook(this._$rootElement, 'tooltipInner');
  }

  get node(): HTMLElement {
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
    this._$tooltipInner.innerText = text;
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
