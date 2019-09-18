import htmlToElement from '../ui/core/htmlToElement';

import { containerTemplate } from './templates';

import View from '../ui/core/view';
import { IView } from '../ui/core/types';

import {
  IRootContainerViewCallbacks,
  IRootContainerViewConfig,
  IRootContainerViewStyles,
} from './types';

import styles from './root-container.scss';

class RootContainerView extends View<IRootContainerViewStyles>
  implements IView<IRootContainerViewStyles> {
  private _$rootElement: HTMLElement;
  private _callbacks: IRootContainerViewCallbacks;

  constructor(config: IRootContainerViewConfig) {
    super();
    const { width, height, fillAllSpace, callbacks, rtl } = config;
    this._callbacks = callbacks;
    this._$rootElement = htmlToElement(
      containerTemplate({ styles: this.styleNames }),
    );

    this.setFillAllSpaceFlag(fillAllSpace);
    this.setRtl(rtl);

    this.setWidth(width);
    this.setHeight(height);

    this._bindEvents();
  }

  private _bindEvents() {
    this._$rootElement.addEventListener(
      'mouseenter',
      this._callbacks.onMouseEnter,
    );
    this._$rootElement.addEventListener(
      'mousemove',
      this._callbacks.onMouseMove,
    );
    this._$rootElement.addEventListener(
      'mouseleave',
      this._callbacks.onMouseLeave,
    );
  }

  private _unbindEvents() {
    this._$rootElement.removeEventListener(
      'mouseenter',
      this._callbacks.onMouseEnter,
    );
    this._$rootElement.removeEventListener(
      'mousemove',
      this._callbacks.onMouseMove,
    );
    this._$rootElement.removeEventListener(
      'mouseleave',
      this._callbacks.onMouseLeave,
    );
  }

  setWidth(width: number) {
    if (!width) {
      return;
    }
    const widthStyle = `${width}px`;
    this._$rootElement.style.width = widthStyle;
    this._$rootElement.style.minWidth = widthStyle;
  }

  setHeight(height: number) {
    if (!height) {
      return;
    }

    const heightStyle = `${height}px`;
    this._$rootElement.style.height = heightStyle;
    this._$rootElement.style.minHeight = heightStyle;
  }

  getWidth(): number {
    return this._$rootElement.offsetWidth;
  }

  getHeight(): number {
    return this._$rootElement.offsetHeight;
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  appendComponentElement(element: HTMLElement) {
    this._$rootElement.appendChild(element);
  }

  getElement(): HTMLElement {
    return this._$rootElement;
  }

  setFullScreenState(isFullScreen: boolean) {
    if (isFullScreen) {
      this._$rootElement.setAttribute('data-playable-in-full-screen', 'true');
      this._$rootElement.classList.add(this.styleNames.fullScreen);
    } else {
      this._$rootElement.setAttribute('data-playable-in-full-screen', 'false');
      this._$rootElement.classList.remove(this.styleNames.fullScreen);
    }
  }

  setFillAllSpaceFlag(isFillAllSpace = false) {
    if (isFillAllSpace) {
      this._$rootElement.classList.add(this.styleNames.fillAllSpace);
    } else {
      this._$rootElement.classList.remove(this.styleNames.fillAllSpace);
    }
  }

  setRtl(rtl: boolean) {
    this._$rootElement.setAttribute('data-playable-dir', rtl ? 'rtl' : 'ltr');
  }

  destroy() {
    this._unbindEvents();

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

RootContainerView.extendStyleNames(styles);

export default RootContainerView;
