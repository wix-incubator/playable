import htmlToElement from '../ui/core/htmlToElement';

import { containerTemplate } from './templates';

import View from '../ui/core/view';
import { IView } from '../ui/core/types';

import {
  IRootContainerViewStyles,
  IRootContainerViewConfig,
  IRootContainerViewCallbacks,
} from './types';

import styles from './root-container.scss';

class RootContainerView extends View<IRootContainerViewStyles>
  implements IView<IRootContainerViewStyles> {
  private _$node: HTMLElement;
  private _callbacks: IRootContainerViewCallbacks;

  constructor(config: IRootContainerViewConfig) {
    super();
    const { width, height, fillAllSpace, callbacks } = config;
    this._callbacks = callbacks;
    this._$node = htmlToElement(containerTemplate({ styles: this.styleNames }));

    this.setFillAllSpaceFlag(fillAllSpace);

    this.setWidth(width);
    this.setHeight(height);

    this._bindEvents();
  }

  private _bindEvents() {
    this._$node.addEventListener('mouseenter', this._callbacks.onMouseEnter);
    this._$node.addEventListener('mousemove', this._callbacks.onMouseMove);
    this._$node.addEventListener('mouseleave', this._callbacks.onMouseLeave);
  }

  private _unbindEvents() {
    this._$node.removeEventListener('mouseenter', this._callbacks.onMouseEnter);
    this._$node.removeEventListener('mousemove', this._callbacks.onMouseMove);
    this._$node.removeEventListener('mouseleave', this._callbacks.onMouseLeave);
  }

  setWidth(width: number) {
    if (!width) {
      return;
    }

    this._$node.style.width = `${width}px`;
  }

  setHeight(height: number) {
    if (!height) {
      return;
    }

    this._$node.style.height = `${height}px`;
  }

  getWidth(): number {
    return this._$node.offsetWidth;
  }

  getHeight(): number {
    return this._$node.offsetHeight;
  }

  show() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  hide() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  appendComponentNode(node) {
    this._$node.appendChild(node);
  }

  getNode(): HTMLElement {
    return this._$node;
  }

  setFullScreenStatus(isFullScreen: boolean) {
    if (isFullScreen) {
      this._$node.setAttribute('data-in-full-screen', 'true');
      this._$node.classList.add(this.styleNames.fullScreen);
    } else {
      this._$node.setAttribute('data-in-full-screen', 'false');
      this._$node.classList.remove(this.styleNames.fullScreen);
    }
  }

  setFillAllSpaceFlag(isFillAllSpace = false) {
    if (isFillAllSpace) {
      this._$node.classList.add(this.styleNames.fillAllSpace);
    } else {
      this._$node.classList.remove(this.styleNames.fillAllSpace);
    }
  }

  destroy() {
    this._unbindEvents();
    this._callbacks = null;

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    this._$node = null;
  }
}

RootContainerView.extendStyleNames(styles);

export default RootContainerView;
