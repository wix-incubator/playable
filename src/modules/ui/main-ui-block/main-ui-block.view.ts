import View from '../core/view';

import { mainUIBlockTemplate } from './templates';
import htmlToElement from '../core/htmlToElement';
import styles from './main-ui-block.scss';

import {
  IMainUIBlockViewStyles,
  IMainUIBlockViewConfig,
  IMainUIBlockViewElements,
} from './types';

class MainUIBlockView extends View<IMainUIBlockViewStyles>
  implements Playable.IView<IMainUIBlockViewStyles> {
  private _$node: HTMLElement;

  constructor(config: IMainUIBlockViewConfig) {
    super();

    this._initDOM(config.elements);
  }

  private _initDOM(elements: IMainUIBlockViewElements) {
    this._$node = htmlToElement(
      mainUIBlockTemplate({
        styles: this.styleNames,
      }),
    );

    const $tooltipContainerWrapper = document.createElement('div');
    $tooltipContainerWrapper.classList.add(
      this.styleNames.tooltipContainerWrapper,
    );
    $tooltipContainerWrapper.appendChild(elements.tooltipContainer);

    this._$node.appendChild(elements.topBlock);
    this._$node.appendChild($tooltipContainerWrapper);
    this._$node.appendChild(elements.bottomBlock);
  }

  getNode() {
    return this._$node;
  }

  destroy() {
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    this._$node = null;
  }
}

MainUIBlockView.extendStyleNames(styles);

export { IMainUIBlockViewConfig };

export default MainUIBlockView;
