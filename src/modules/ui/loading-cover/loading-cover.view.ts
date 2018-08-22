import View from '../core/view';
import { IView } from '../core/types';

import { ILoadingCoverConfig, ILoadingCoverViewStyles } from './types';

import { loadingCoverTemplate } from './templates';

import getElementByHook from '../core/getElementByHook';
import htmlToElement from '../core/htmlToElement';

import styles from './loading-cover.scss';

class LoadingCoverView extends View<ILoadingCoverViewStyles>
  implements IView<ILoadingCoverViewStyles> {
  private _$rootElement: HTMLElement;
  private _$image: HTMLElement;

  constructor(config: ILoadingCoverConfig) {
    super();

    this._initDOM();

    this.setCover(config.url);
  }

  getNode() {
    return this._$rootElement;
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      loadingCoverTemplate({
        styles: this.styleNames,
      }),
    );

    this._$image = getElementByHook(
      this._$rootElement,
      'playable-loading-cover-image',
    );
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
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
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

LoadingCoverView.extendStyleNames(styles);

export default LoadingCoverView;
