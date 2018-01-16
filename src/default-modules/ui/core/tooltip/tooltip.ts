import { tooltipTemplate } from './templates';
import htmlToElement from '../htmlToElement';
import getElementByHook from '../getElementByHook';
import Stylable from '../stylable';

import * as styles from './tooltip.scss';

type ITooltipStyles = {
  tooltip: string;
  tooltipVisible: string;
  tooltipInner: string;
};

interface ITooltip {
  node: HTMLElement;
  isHidden: boolean;
  show(): void;
  hide(): void;
  setTitle(title: string): void;
  setStyle(style: { [key: string]: string | number }): void;
  destroy(): void;
}

class Tooltip extends Stylable<ITooltipStyles> implements ITooltip {
  private _$node: HTMLElement;
  private _$tooltipInner: HTMLElement;
  private _isHidden: boolean;

  constructor() {
    super();

    this._isHidden = true;
    this._initDOM();
  }

  private _initDOM() {
    this._$node = htmlToElement(
      tooltipTemplate({
        styles: this.styleNames,
      }),
    );
    this._$tooltipInner = getElementByHook(this._$node, 'tooltipInner');
  }

  get node(): HTMLElement {
    return this._$node;
  }

  get isHidden(): boolean {
    return this._isHidden;
  }

  show() {
    if (!this._isHidden) {
      return;
    }
    this._isHidden = false;
    this._$node.classList.add(this.styleNames.tooltipVisible);
  }

  hide() {
    if (this._isHidden) {
      return;
    }
    this._isHidden = true;
    this._$node.classList.remove(this.styleNames.tooltipVisible);
  }

  setTitle(title: string) {
    this._$tooltipInner.innerText = title;
  }

  setStyle(style) {
    Object.keys(style).forEach(styleKey => {
      this._$node.style[styleKey] = style[styleKey];
    });
  }

  destroy() {
    this._$node = null;
    this._$tooltipInner = null;
  }
}

Tooltip.extendStyleNames(styles);

export { ITooltip, ITooltipStyles };

export default Tooltip;
