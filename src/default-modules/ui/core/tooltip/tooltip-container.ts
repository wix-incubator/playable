import { createTooltipContainerTemplate } from './templates';
import htmlToElement from '../htmlToElement';
import Tooltip from './tooltip';
import Stylable from '../stylable';

import { ITooltipShowOptions, ITooltipPosition } from './types';

import * as styles from './tooltip-container.scss';

interface ITooltipContainer {
  node: HTMLElement;
  isHidden: boolean;
  show(options: ITooltipShowOptions): void;
  hide(): void;
  setTitle(title: string): void;
  destroy(): void;
}

class TooltipContainer extends Stylable implements ITooltipContainer {
  private _tooltip: Tooltip;
  private _$node: HTMLElement;

  constructor() {
    super();

    this._initDOM();
  }

  get node(): HTMLElement {
    return this._$node;
  }

  get isHidden(): boolean {
    return this._tooltip.isHidden;
  }

  private _initDOM() {
    this._$node = htmlToElement(
      createTooltipContainerTemplate({
        styles: this.styleNames,
      }),
    );
    this._tooltip = new Tooltip();

    this._$node.appendChild(this._tooltip.node);
  }

  setTitle(title) {
    this._tooltip.setTitle(title);
  }

  show(options: ITooltipShowOptions) {
    this._tooltip.setTitle(options.title);
    this._updateTooltipPosition(options.position);
    this._tooltip.show();
  }

  hide() {
    this._tooltip.hide();
  }

  destroy() {
    this._tooltip.destroy();
    this._tooltip = null;
    this._$node = null;
  }

  private _updateTooltipPosition(position: ITooltipPosition) {
    this._tooltip.setStyle({
      left: `${this._getTooltipLeftX(position.x)}px`,
      'align-self': position.placement === 'top' ? 'flex-start' : 'flex-end',
    });
  }

  private _getTooltipLeftX(tooltipCenterX: number) {
    const tooltipRect = this._tooltip.node.getBoundingClientRect();
    const tooltipContainerRect = this._$node.getBoundingClientRect();

    let tooltipLeftX = tooltipCenterX - tooltipRect.width / 2;

    // ensure `x` is in range of placeholder rect
    tooltipLeftX = Math.max(tooltipLeftX, 0);
    tooltipLeftX = Math.min(
      tooltipLeftX,
      tooltipContainerRect.width - tooltipRect.width,
    );

    return tooltipLeftX;
  }
}

TooltipContainer.extendStyleNames(styles);

export { ITooltipContainer };
export default TooltipContainer;
