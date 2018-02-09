import View from '../core/view';
import { IView } from '../core/types';

import { ILoadingCoverViewStyles } from './types';

import { loadingCoverTemplate } from './templates';

import getElementByHook from '../core/getElementByHook';
import htmlToElement from '../core/htmlToElement';

import styles from './loading-cover.scss';

class LoadingCoverView extends View<ILoadingCoverViewStyles>
  implements IView<ILoadingCoverViewStyles> {
  private _$node: HTMLElement;
  private _$image: HTMLElement;

  constructor(config) {
    super();

    this._initDOM();

    this.setCover(config.url);
  }

  getNode() {
    return this._$node;
  }

  private _initDOM() {
    this._$node = htmlToElement(
      loadingCoverTemplate({
        styles: this.styleNames,
      }),
    );

    this._$image = getElementByHook(this._$node, 'loading-cover-image');
  }

  hide() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  setCover(url) {
    if (url) {
      this._$image.classList.add(this.styleNames.hidden);

      const onImageLoad = () => {
        this._$image.classList.remove(this.styleNames.hidden);
        this._$image.removeEventListener('load', onImageLoad);
      };

      this._$image.addEventListener('load', onImageLoad);
      this._$image.setAttribute('src', url);
    }
  }

  destroy() {
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
  }
}

LoadingCoverView.extendStyleNames(styles);

export default LoadingCoverView;
