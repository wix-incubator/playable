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
  private _$titleContainer: HTMLElement;
  private _$liveIndicatorContainer: HTMLElement;

  constructor(config: ITopBlockViewConfig) {
    super();
    const { elements } = config;

    this._initDOM(elements);
    this._bindEvents();
  }

  getElement() {
    return this._$rootElement;
  }

  private _initDOM(elements: ITopBlockViewElements) {
    this._$rootElement = htmlToElement(
      topBlockTemplate({
        styles: this.styleNames,
      }),
    );

    this._$titleContainer = getElementByHook(
      this._$rootElement,
      'title-container',
    );
    this._$liveIndicatorContainer = getElementByHook(
      this._$rootElement,
      'live-indicator-container',
    );

    this._$titleContainer.appendChild(elements.title);
    this._$liveIndicatorContainer.appendChild(elements.liveIndicator);
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

  showContent() {
    this._$rootElement.classList.add(this.styleNames.activated);
  }

  hideContent() {
    this._$rootElement.classList.remove(this.styleNames.activated);
  }

  showTitle() {
    this._$titleContainer.classList.remove(this.styleNames.hidden);
  }

  hideTitle() {
    this._$titleContainer.classList.add(this.styleNames.hidden);
  }

  showLiveIndicator() {
    this._$liveIndicatorContainer.classList.remove(this.styleNames.hidden);
  }

  hideLiveIndicator() {
    this._$liveIndicatorContainer.classList.add(this.styleNames.hidden);
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
