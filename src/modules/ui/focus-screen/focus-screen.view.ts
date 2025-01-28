import View from '../core/view';
import { IView } from '../core/types';

import { focusScreenTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import toggleElementClass from '../core/toggleElementClass';

import {
  IFocusScreenViewStyles,
  IFocusScreenViewCallbacks,
  IFocusScreenViewConfig,
} from './types';

import styles from './focus-screen.scss';

class ScreenView extends View<IFocusScreenViewStyles>
  implements IView<IFocusScreenViewStyles> {
  private _callbacks: IFocusScreenViewCallbacks;

  private _$rootElement: HTMLElement;

  constructor(config: IFocusScreenViewConfig) {
    super();
    const { callbacks } = config;

    this._callbacks = callbacks;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      focusScreenTemplate({
        styles: this.styleNames,
      }),
    );
  }

  private _bindEvents() {
    this._$rootElement.addEventListener(
      'click',
      this._callbacks.onWrapperMouseClick,
    );
    this._$rootElement.addEventListener(
      'dblclick',
      this._callbacks.onWrapperMouseDblClick,
    );
  }

  private _unbindEvents() {
    this._$rootElement.removeEventListener(
      'click',
      this._callbacks.onWrapperMouseClick,
    );
    this._$rootElement.removeEventListener(
      'dblclick',
      this._callbacks.onWrapperMouseDblClick,
    );
  }

  focusOnNode() {
    this._$rootElement.focus();
  }

  show() {
    toggleElementClass(this._$rootElement, this.styleNames.hidden, false);
  }

  hide() {
    toggleElementClass(this._$rootElement, this.styleNames.hidden, true);
  }

  getElement() {
    return this._$rootElement;
  }

  hideCursor() {
    toggleElementClass(this._$rootElement, this.styleNames.hiddenCursor, true);
  }

  showCursor() {
    toggleElementClass(this._$rootElement, this.styleNames.hiddenCursor, false);
  }

  destroy() {
    this._unbindEvents();
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

ScreenView.extendStyleNames(styles);

export default ScreenView;
