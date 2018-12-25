import View from '../core/view';
import { IView } from '../core/types';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import {
  topButtonsTemplate,
  infoButtonTemplate,
  buyButtonTemplate,
  cardsButtonTemplate,
  commentButtonTemplate,
  shareButtonTemplate,
} from './templates';

import { ITopButtonsViewStyles } from './types';

import styles from './top-buttons.scss';
const a = [
  infoButtonTemplate,
  buyButtonTemplate,
  cardsButtonTemplate,
  commentButtonTemplate,
  shareButtonTemplate,
];
class TopButtonsView extends View<ITopButtonsViewStyles>
  implements IView<ITopButtonsViewStyles> {
  private _$rootElement: HTMLElement;
  private _$buttonsContainer: HTMLElement;
  private _$toggler: HTMLElement;
  private _timeoutID: number;
  constructor() {
    super();
    this._bindCallbacks();

    this._initDOM();
    this._bindEvents();

    this.reset();
  }

  getElement() {
    return this._$rootElement;
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      topButtonsTemplate({
        styles: this.styleNames,
      }),
    );

    this._$buttonsContainer = getElementByHook(
      this._$rootElement,
      'buttons-container',
    );

    this._$toggler = getElementByHook(this._$rootElement, 'toggler');
    a.forEach(temp => {
      this._$buttonsContainer.appendChild(
        htmlToElement(
          temp({
            styles: this.styleNames,
          }),
        ),
      );
    });
  }

  private _bindCallbacks() {
    this._onResize = this._onResize.bind(this);
    this._growButtons = this._growButtons.bind(this);
    this._shrinkButtons = this._shrinkButtons.bind(this);
    this._checkShow = this._checkShow.bind(this);
    this._triggerShow = this._triggerShow.bind(this);
    this._triggerHide = this._triggerHide.bind(this);
  }

  private _bindEvents() {
    this._$toggler.addEventListener('click', this._growButtons);
    this._$toggler.addEventListener('mouseenter', this._triggerShow);
    this._$rootElement.addEventListener('mouseleave', this._triggerHide);
    this._$rootElement.addEventListener('mouseenter', this._checkShow);
  }

  private _unbindEvents() {
    this._$toggler.removeEventListener('click', this._growButtons);
  }

  private _growButtons() {
    this._$rootElement.classList.remove(this.styleNames.shrinked);
  }

  private _shrinkButtons() {
    this._$rootElement.classList.add(this.styleNames.shrinked);
  }

  resizeElements() {
    //this._onResize();
  }

  private _onResize([element]: ResizeObserverEntry[]) {
    const {
      contentRect: { width, height },
    } = element;

    this._$buttonsContainer.style.width = `${width}px`;
    this._$buttonsContainer.style.maxWidth = `${width}px`;

    this._$buttonsContainer.style.height = `${height}px`;
    this._$buttonsContainer.style.minHeight = `${height}px`;
  }

  private _triggerShow() {
    this._clearHideTimeout();

    this._growButtons();
  }

  private _triggerHide() {
    if (!this._timeoutID) {
      this._clearHideTimeout();

      this._timeoutID = window.setTimeout(this._shrinkButtons, 1000);
    }
  }

  private _checkShow() {
    if (this._timeoutID) {
      this._clearHideTimeout();
    }
  }

  private _clearHideTimeout() {
    clearTimeout(this._timeoutID);
    this._timeoutID = null;
  }

  reset() {
    this._$rootElement.classList.add(this.styleNames.shrinked);
  }

  destroy() {
    this._unbindEvents();
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

TopButtonsView.extendStyleNames(styles);

export default TopButtonsView;
