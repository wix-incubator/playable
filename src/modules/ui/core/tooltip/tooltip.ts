import { tooltipTemplate } from './templates';
import htmlToElement from '../htmlToElement';
import getElementByHook from '../getElementByHook';
import Stylable from '../stylable';

import styles from './tooltip.scss';

class Tooltip extends Stylable<Playable.ITooltipStyles>
  implements Playable.ITooltip {
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

  setText(text: string) {
    this._$tooltipInner.innerText = text;
  }

  setStyle(style: any) {
    Object.keys(style).forEach(styleKey => {
      (this._$node.style as any)[styleKey] = style[styleKey];
    });
  }

  destroy() {
    this._$node = null;
    this._$tooltipInner = null;
  }
}

Tooltip.extendStyleNames(styles);

export default Tooltip;
