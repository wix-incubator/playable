import View from '../core/view';

import { titleTemplate } from './templates';
import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleNodeClass from '../core/toggleNodeClass';

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

  private _$node: HTMLElement;
  _$title: HTMLElement;

  constructor(config: ITitleViewConfig) {
    const { callbacks, theme } = config;

    super(theme);

    this._callbacks = callbacks;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$node = htmlToElement(
      titleTemplate({ styles: this.styleNames, themeStyles: this.themeStyles }),
    );
    this._$title = getElementByHook(this._$node, 'video-title');
  }

  private _bindEvents() {
    this._$title.addEventListener('click', this._callbacks.onClick);
  }

  private _unbindEvents() {
    this._$title.removeEventListener('click', this._callbacks.onClick);
  }

  setDisplayAsLink(flag: boolean) {
    toggleNodeClass(this._$title, this.styleNames.link, flag);
  }

  setTitle(title?: string) {
    // TODO: mb move this logic to controller? title.isHidden is out of control of this method
    // TODO: what if we call with empty value `.setTitle('')` and then call `.show()` method? Mb clear value anyway?
    if (title) {
      this.show();
      this._$title.innerHTML = title;
    } else {
      this.hide();
    }
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

  destroy() {
    this._unbindEvents();
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
    delete this._$title;
  }
}

TitleView.setTheme(titleViewTheme);
TitleView.extendStyleNames(styles);

export default TitleView;
