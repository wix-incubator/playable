import View from '../core/view';

import { titleTemplate } from './templates';
import htmlToElement from '../core/htmlToElement';
import toggleElementClass from '../core/toggleElementClass';

import {
  ITitleViewStyles,
  ITitleViewCallbacks,
  ITitleViewConfig,
} from './types';
import { IView } from '../core/types';

import titleViewTheme from './title.theme';
import styles from './title.scss';

class TitleView extends View<ITitleViewStyles>
  implements IView<ITitleViewStyles> {
  private _callbacks: ITitleViewCallbacks;

  private _$rootElement: HTMLElement;

  constructor(config: ITitleViewConfig) {
    const { callbacks, theme } = config;

    super(theme);

    this._callbacks = callbacks;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      titleTemplate({ styles: this.styleNames, themeStyles: this.themeStyles }),
    );
  }

  private _bindEvents() {
    this._$rootElement.addEventListener('click', this._callbacks.onClick);
  }

  private _unbindEvents() {
    this._$rootElement.removeEventListener('click', this._callbacks.onClick);
  }

  setDisplayAsLink(flag: boolean) {
    toggleElementClass(this._$rootElement, this.styleNames.link, flag);
  }

  setTitle(title?: string) {
    // TODO: mb move this logic to controller? title.isHidden is out of control of this method
    // TODO: what if we call with empty value `.setTitle('')` and then call `.show()` method? Mb clear value anyway?
    if (title) {
      this.show();
      this._$rootElement.innerHTML = title;
    } else {
      this.hide();
    }
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

  destroy() {
    this._unbindEvents();
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

TitleView.setTheme(titleViewTheme);
TitleView.extendStyleNames(styles);

export default TitleView;
