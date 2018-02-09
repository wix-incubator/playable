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
import * as styles from './overlay.scss';

class OverlayView extends View<IOverlayViewStyles>
  implements IView<IOverlayViewStyles> {
  private _callbacks: IOverlayViewCallbacks;

  private _$node: HTMLElement;
  private _$content: HTMLElement;
  private _$playButton: HTMLElement;

  constructor(config: IOverlayViewConfig) {
    super(config.theme);

    const { callbacks, src } = config;

    this._callbacks = callbacks;

    this._initDOM();
    this._bindEvents();

    this.setPoster(src);
  }

  private _initDOM() {
    this._$node = htmlToElement(
      overlayTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
      }),
    );

    this._$content = getElementByHook(this._$node, 'overlay-content');
    this._$playButton = getElementByHook(this._$node, 'overlay-play-button');
  }

  private _bindEvents() {
    this._$playButton.addEventListener('click', this._callbacks.onPlayClick);
  }

  private _unbindEvents() {
    this._$playButton.removeEventListener('click', this._callbacks.onPlayClick);
  }

  getNode() {
    return this._$node;
  }

  hideContent() {
    this._$node.classList.remove(this.styleNames.active);
  }

  showContent() {
    this._$node.classList.add(this.styleNames.active);
  }

  hide() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  setPoster(src: string) {
    this._$content.style.backgroundImage = src ? `url('${src}')` : 'none';
  }

  destroy() {
    this._unbindEvents();

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
    delete this._$content;
    delete this._$playButton;
  }
}

OverlayView.setTheme(overlayViewTheme);
OverlayView.extendStyleNames(styles);

export default OverlayView;
