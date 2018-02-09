import View from '../core/view';
import { IView } from '../core/types';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleNodeClass from '../core/toggleNodeClass';

import { bottomBlockTemplate } from './templates';

import {
  IBottomBlockViewStyles,
  IBottomBlockViewCallbacks,
  IBottomBlockViewElements,
  IBottomBlockViewConfig,
} from './types';

import styles from './bottom-block.scss';

class BottomBlockView extends View<IBottomBlockViewStyles>
  implements IView<IBottomBlockViewStyles> {
  private _callbacks: IBottomBlockViewCallbacks;
  private _$node: HTMLElement;

  constructor(config: IBottomBlockViewConfig) {
    super();
    const { callbacks, elements } = config;

    this._callbacks = callbacks;

    this._initDOM(elements);
    this._bindEvents();
  }

  private _initDOM(elements: IBottomBlockViewElements) {
    this._$node = htmlToElement(
      bottomBlockTemplate({
        styles: this.styleNames,
      }),
    );

    const $playContainer = getElementByHook(this._$node, 'play-container');
    const $volumeContainer = getElementByHook(this._$node, 'volume-container');
    const $timeContainer = getElementByHook(this._$node, 'time-container');
    const $fullScreenContainer = getElementByHook(
      this._$node,
      'full-screen-container',
    );
    const $logoContainer = getElementByHook(this._$node, 'logo-container');
    const $progressBarContainer = getElementByHook(
      this._$node,
      'progress-bar-container',
    );

    $playContainer.appendChild(elements.play);
    $volumeContainer.appendChild(elements.volume);
    $timeContainer.appendChild(elements.time);
    $fullScreenContainer.appendChild(elements.fullScreen);
    $logoContainer.appendChild(elements.logo);
    $progressBarContainer.appendChild(elements.progress);
  }

  private _preventClickPropagation(e) {
    e.stopPropagation();
  }

  private _bindEvents() {
    this._$node.addEventListener('click', this._preventClickPropagation);
    this._$node.addEventListener('mousemove', this._callbacks.onBlockMouseMove);
    this._$node.addEventListener('mouseleave', this._callbacks.onBlockMouseOut);
  }

  private _unbindEvents() {
    this._$node.removeEventListener('click', this._preventClickPropagation);
    this._$node.removeEventListener(
      'mousemove',
      this._callbacks.onBlockMouseMove,
    );
    this._$node.removeEventListener(
      'mouseleave',
      this._callbacks.onBlockMouseOut,
    );
  }

  setShouldLogoShowAlwaysFlag(isShowAlways: boolean) {
    toggleNodeClass(this._$node, this.styleNames.showLogoAlways, isShowAlways);
    this._$node.classList.remove(this.styleNames.logoHidden);
  }

  hideLogo() {
    this._$node.classList.add(this.styleNames.logoHidden);
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

BottomBlockView.extendStyleNames(styles);

export default BottomBlockView;
