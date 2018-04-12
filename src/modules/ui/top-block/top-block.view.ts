import View from '../core/view';
import { IView } from '../core/types';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import { topBlockTemplate } from './templates';

import {
  ITopBlockViewStyles,
  ITopBlockViewConfig,
  ITopBlockViewElements,
} from './types';

import styles from './top-block.scss';

class TopBlockView extends View<ITopBlockViewStyles>
  implements IView<ITopBlockViewStyles> {
  private _$node: HTMLElement;

  constructor(config: ITopBlockViewConfig) {
    super();
    const { elements } = config;

    this._initDOM(elements);
    this._bindEvents();
  }

  private _initDOM(elements: ITopBlockViewElements) {
    this._$node = htmlToElement(
      topBlockTemplate({
        styles: this.styleNames,
      }),
    );

    const $titleContainer = getElementByHook(this._$node, 'title-container');
    const $liveIndicatorContainer = getElementByHook(
      this._$node,
      'live-indicator-container',
    );

    $titleContainer.appendChild(elements.title);
    $liveIndicatorContainer.appendChild(elements.liveIndicator);
  }

  private _preventClickPropagation(e) {
    e.stopPropagation();
  }

  private _bindEvents() {
    this._$node.addEventListener('click', this._preventClickPropagation);
  }

  private _unbindEvents() {
    this._$node.removeEventListener('click', this._preventClickPropagation);
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  getNode() {
    return this._$node;
  }

  showContent() {
    this._$node.classList.add(this.styleNames.activated);
  }

  hideContent() {
    this._$node.classList.remove(this.styleNames.activated);
  }

  destroy() {
    this._unbindEvents();
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }
    delete this._$node;
  }
}

TopBlockView.extendStyleNames(styles);

export default TopBlockView;
