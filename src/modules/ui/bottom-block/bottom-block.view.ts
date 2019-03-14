import View from '../core/view';
import { IView } from '../core/types';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleElementClass from '../core/toggleElementClass';

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
  private _$rootElement: HTMLElement;

  constructor(config: IBottomBlockViewConfig) {
    super();
    const { callbacks, elements } = config;

    this._callbacks = callbacks;

    this._initDOM(elements);
    this._bindEvents();
  }

  private _initDOM(elements: IBottomBlockViewElements) {
    this._$rootElement = htmlToElement(
      bottomBlockTemplate({
        styles: this.styleNames,
      }),
    );

    const $playContainer = getElementByHook(
      this._$rootElement,
      'play-container',
    );
    const $volumeContainer = getElementByHook(
      this._$rootElement,
      'volume-container',
    );
    const $timeContainer = getElementByHook(
      this._$rootElement,
      'time-container',
    );
    const $fullScreenContainer = getElementByHook(
      this._$rootElement,
      'full-screen-container',
    );
    const $logoContainer = getElementByHook(
      this._$rootElement,
      'logo-container',
    );
    const $progressBarContainer = getElementByHook(
      this._$rootElement,
      'progress-bar-container',
    );

    const $downloadContainer = getElementByHook(
      this._$rootElement,
      'download-container',
    );

    const $chromecastContainer = getElementByHook(
      this._$rootElement,
      'chromecast-container',
    );

    $playContainer.appendChild(elements.play);
    $volumeContainer.appendChild(elements.volume);
    $timeContainer.appendChild(elements.time);
    $fullScreenContainer.appendChild(elements.fullScreen);
    $logoContainer.appendChild(elements.logo);
    $progressBarContainer.appendChild(elements.progress);
    $downloadContainer.appendChild(elements.download);
    $chromecastContainer.appendChild(elements.chromecast);
  }

  private _preventClickPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  private _bindEvents() {
    this._$rootElement.addEventListener('click', this._preventClickPropagation);
    this._$rootElement.addEventListener(
      'mousemove',
      this._callbacks.onBlockMouseMove,
    );
    this._$rootElement.addEventListener(
      'mouseleave',
      this._callbacks.onBlockMouseOut,
    );
  }

  private _unbindEvents() {
    this._$rootElement.removeEventListener(
      'click',
      this._preventClickPropagation,
    );
    this._$rootElement.removeEventListener(
      'mousemove',
      this._callbacks.onBlockMouseMove,
    );
    this._$rootElement.removeEventListener(
      'mouseleave',
      this._callbacks.onBlockMouseOut,
    );
  }

  setShouldLogoShowAlwaysFlag(isShowAlways: boolean) {
    toggleElementClass(
      this._$rootElement,
      this.styleNames.showLogoAlways,
      isShowAlways,
    );
    this.showLogo();
  }

  showPlayControl() {
    this._$rootElement.classList.remove(this.styleNames.playControlHidden);
  }

  hidePlayControl() {
    this._$rootElement.classList.add(this.styleNames.playControlHidden);
  }

  showTimeControl() {
    this._$rootElement.classList.remove(this.styleNames.timeControlHidden);
  }

  hideTimeControl() {
    this._$rootElement.classList.add(this.styleNames.timeControlHidden);
  }

  showVolumeControl() {
    this._$rootElement.classList.remove(this.styleNames.volumeControlHidden);
  }

  hideVolumeControl() {
    this._$rootElement.classList.add(this.styleNames.volumeControlHidden);
  }

  showFullScreenControl() {
    this._$rootElement.classList.remove(
      this.styleNames.fullScreenControlHidden,
    );
  }

  hideFullScreenControl() {
    this._$rootElement.classList.add(this.styleNames.fullScreenControlHidden);
  }

  showLogo() {
    this._$rootElement.classList.remove(this.styleNames.logoHidden);
  }

  hideLogo() {
    this._$rootElement.classList.add(this.styleNames.logoHidden);
  }

  showProgressControl() {
    this._$rootElement.classList.remove(this.styleNames.progressControlHidden);
  }

  hideProgressControl() {
    this._$rootElement.classList.add(this.styleNames.progressControlHidden);
  }

  showDownloadButton() {
    this._$rootElement.classList.remove(this.styleNames.downloadButtonHidden);
  }

  hideDownloadButton() {
    this._$rootElement.classList.add(this.styleNames.downloadButtonHidden);
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

BottomBlockView.extendStyleNames(styles);

export default BottomBlockView;
