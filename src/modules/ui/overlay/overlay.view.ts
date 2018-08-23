import View from '../core/view';
import { IView } from '../core/types';

import { overlayTemplate } from './templates';
import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import {
  IOverlayViewConfig,
  IOverlayViewCallbacks,
  IOverlayViewStyles,
} from './types';

import overlayViewTheme from './overlay.theme';
import styles from './overlay.scss';

class OverlayView extends View<IOverlayViewStyles>
  implements IView<IOverlayViewStyles> {
  private _callbacks: IOverlayViewCallbacks;

  private _$rootElement: HTMLElement;
  private _$content: HTMLElement;
  private _$playButton: HTMLElement;

  constructor(config: IOverlayViewConfig) {
    super(config.theme);

    const { callbacks } = config;

    this._callbacks = callbacks;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      overlayTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
      }),
    );

    this._$content = getElementByHook(
      this._$rootElement,
      'playable-overlay-content',
    );
    this._$playButton = getElementByHook(
      this._$rootElement,
      'playable-overlay-play-button',
    );
  }

  private _bindEvents() {
    this._$playButton.addEventListener('click', this._callbacks.onPlayClick);
  }

  private _unbindEvents() {
    this._$playButton.removeEventListener('click', this._callbacks.onPlayClick);
  }

  getElement() {
    return this._$rootElement;
  }

  hideContent() {
    this._$rootElement.classList.remove(this.styleNames.active);
  }

  showContent() {
    this._$rootElement.classList.add(this.styleNames.active);
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  setPoster(src: string) {
    this._$content.style.backgroundImage = src ? `url('${src}')` : 'none';
  }

  destroy() {
    this._unbindEvents();

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
    this._$content = null;
    this._$playButton = null;
  }
}

OverlayView.setTheme(overlayViewTheme);
OverlayView.extendStyleNames(styles);

export default OverlayView;
