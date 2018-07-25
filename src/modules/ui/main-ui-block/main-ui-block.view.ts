import View from '../core/view';
import { IView } from '../core/types';

import { mainUIBlockTemplate } from './templates';
import htmlToElement from '../core/htmlToElement';
import styles from './main-ui-block.scss';

import {
  IMainUIBlockViewStyles,
  IMainUIBlockViewConfig,
  IMainUIBlockViewElements,
} from './types';

class MainUIBlockView extends View<IMainUIBlockViewStyles>
  implements IView<IMainUIBlockViewStyles> {
  private _$rootElement: HTMLElement;

  constructor(config: IMainUIBlockViewConfig) {
    super();

    this._initDOM(config.elements);
  }

  private _initDOM(elements: IMainUIBlockViewElements) {
    this._$rootElement = htmlToElement(
      mainUIBlockTemplate({
        styles: this.styleNames,
      }),
    );

    const $tooltipContainerWrapper = document.createElement('div');
    $tooltipContainerWrapper.classList.add(
      this.styleNames.tooltipContainerWrapper,
    );
    $tooltipContainerWrapper.appendChild(elements.tooltipContainer);

    this._$rootElement.appendChild(elements.topBlock);
    this._$rootElement.appendChild($tooltipContainerWrapper);
    this._$rootElement.appendChild(elements.bottomBlock);
  }

  getNode() {
    return this._$rootElement;
  }

  destroy() {
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

MainUIBlockView.extendStyleNames(styles);

export { IMainUIBlockViewConfig };

export default MainUIBlockView;
