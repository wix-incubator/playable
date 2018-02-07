import { IView } from '../core/types';
import View from '../core/view';

import { loaderTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';

import { ILoaderViewStyles } from './types';

import * as styles from './loader.scss';

class LoaderView extends View<ILoaderViewStyles>
  implements IView<ILoaderViewStyles> {
  private _$node: HTMLElement;

  constructor() {
    super();

    this._$node = htmlToElement(
      loaderTemplate({
        styles: this.styleNames,
      }),
    );
  }

  getNode() {
    return this._$node;
  }

  showContent() {
    this._$node.classList.add(this.styleNames.active);
  }

  hideContent() {
    this._$node.classList.remove(this.styleNames.active);
  }

  hide() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  destroy() {
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
  }
}

LoaderView.extendStyleNames(styles);

export default LoaderView;
