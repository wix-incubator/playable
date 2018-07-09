import { IView } from '../core/types';
import View from '../core/view';

import { loaderTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';

import { ILoaderViewStyles } from './types';

import styles from './loader.scss';

class LoaderView extends View<ILoaderViewStyles>
  implements IView<ILoaderViewStyles> {
  private _$rootElement: HTMLElement;

  constructor() {
    super();

    this._$rootElement = htmlToElement(
      loaderTemplate({
        styles: this.styleNames,
      }),
    );
  }

  getNode() {
    return this._$rootElement;
  }

  showContent() {
    this._$rootElement.classList.add(this.styleNames.active);
  }

  hideContent() {
    this._$rootElement.classList.remove(this.styleNames.active);
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  destroy() {
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

LoaderView.extendStyleNames(styles);

export default LoaderView;
