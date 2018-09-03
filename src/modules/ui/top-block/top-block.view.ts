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
  private _$rootElement: HTMLElement;

  constructor(config: ITopBlockViewConfig) {
    super();
    const { elements } = config;

    this._initDOM(elements);
    this._bindEvents();
  }

  private _initDOM(elements: ITopBlockViewElements) {
    this._$rootElement = htmlToElement(
      topBlockTemplate({
        styles: this.styleNames,
      }),
    );

    const $titleContainer = getElementByHook(
      this._$rootElement,
      'title-container',
    );
    const $liveIndicatorContainer = getElementByHook(
      this._$rootElement,
      'live-indicator-container',
    );

    $titleContainer.appendChild(elements.title);
    $liveIndicatorContainer.appendChild(elements.liveIndicator);
  }

  private _preventClickPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  private _bindEvents() {
    this._$rootElement.addEventListener('click', this._preventClickPropagation);
  }

  private _unbindEvents() {
    this._$rootElement.removeEventListener(
      'click',
      this._preventClickPropagation,
    );
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  getElement() {
    return this._$rootElement;
  }

  showContent() {
    this._$rootElement.classList.add(this.styleNames.activated);
  }

  hideContent() {
    this._$rootElement.classList.remove(this.styleNames.activated);
  }

  destroy() {
    this._unbindEvents();
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

TopBlockView.extendStyleNames(styles);

export default TopBlockView;
