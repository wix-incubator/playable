import View from '../core/view';

import { ILoadingCoverConfig, ILoadingCoverViewStyles } from './types';

import { loadingCoverTemplate } from './templates';

import getElementByHook from '../core/getElementByHook';
import htmlToElement from '../core/htmlToElement';

import styles from './loading-cover.scss';

class LoadingCoverView extends View<ILoadingCoverViewStyles>
  implements Playable.IView<ILoadingCoverViewStyles> {
  private _$node: HTMLElement;
  private _$image: HTMLElement;

  constructor(config: ILoadingCoverConfig) {
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

  setCover(url: string | boolean) {
    if (url && typeof url === 'string') {
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

    this._$node = null;
  }
}

LoadingCoverView.extendStyleNames(styles);

export default LoadingCoverView;
