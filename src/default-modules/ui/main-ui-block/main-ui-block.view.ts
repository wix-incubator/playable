import * as $ from 'jbone';
import View from '../core/view';

import * as styles from './main-ui-block.scss';

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
    this.$node = $('<div>', {
      class: this.styleNames['main-ui-block'],
    });

    const $tooltipContainerWrapper = $('<div>', {
      class: this.styleNames['tooltip-container-wrapper'],
    });

    $tooltipContainerWrapper.append(elements.tooltipContainer);

    this.$node.append(elements.topBlock);
    this.$node.append($tooltipContainerWrapper);
    this.$node.append(elements.bottomBlock);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this.$node.remove();
    delete this.$node;
  }
}

MainUIBlockView.extendStyleNames(styles);

export { IMainUIBlockViewConfig };

export default MainUIBlockView;
