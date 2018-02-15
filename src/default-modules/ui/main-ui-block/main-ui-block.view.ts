import View from '../core/view';

import { mainUIBlockTemplate } from './templates';
import htmlToElement from '../core/htmlToElement';
import styles from './main-ui-block.scss';

type IMainUIBlockViewConfig = {
  elements: {
    tooltipContainer: HTMLElement;
    topBlock: HTMLElement;
    bottomBlock: HTMLElement;
  };
};

class MainUIBlockView extends View {
  $node;

  constructor(config: IMainUIBlockViewConfig) {
    super();

    this._initDOM(config.elements);
  }

  private _initDOM(elements) {
    this.$node = htmlToElement(
      mainUIBlockTemplate({
        styles: this.styleNames,
      }),
    );

    const $tooltipContainerWrapper = document.createElement('div');
    $tooltipContainerWrapper.classList.add(
      this.styleNames['tooltip-container-wrapper'],
    );
    $tooltipContainerWrapper.appendChild(elements.tooltipContainer);

    this.$node.appendChild(elements.topBlock);
    this.$node.appendChild($tooltipContainerWrapper);
    this.$node.appendChild(elements.bottomBlock);
  }

  getNode() {
    return this.$node;
  }

  destroy() {
    if (this.$node.parentNode) {
      this.$node.parentNode.removeChild(this.$node);
    }
    delete this.$node;
  }
}

MainUIBlockView.extendStyleNames(styles);

export { IMainUIBlockViewConfig };

export default MainUIBlockView;
