import View from './top-block.view';

import { ILiveIndicator } from '../live-indicator/types';
import { ITopBlock, ITopBlockViewConfig, ITopBlockViewElements } from './types';

interface IDependencies {
  title: Playable.ITitle;
  liveIndicator: ILiveIndicator;
}

export default class TopBlock implements ITopBlock {
  static moduleName = 'topBlock';
  static View = View;
  static dependencies = ['title', 'liveIndicator'];

  isHidden: boolean;
  view: View;

  constructor(dependencies: IDependencies) {
    this.isHidden = false;

    this._initUI(this._getElementsNodes(dependencies));
  }

  private _initUI(elementNodes: ITopBlockViewElements) {
    const config: ITopBlockViewConfig = {
      elements: elementNodes,
    };

    this.view = new TopBlock.View(config);
  }

  private _getElementsNodes(
    dependencies: IDependencies,
  ): ITopBlockViewElements {
    const { title, liveIndicator } = dependencies;

    return {
      title: title.node,
      liveIndicator: liveIndicator.node,
    };
  }

  get node() {
    return this.view.getNode();
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  showContent() {
    this.view.showContent();
  }

  hideContent() {
    this.view.hideContent();
  }

  destroy() {
    this.view.destroy();
    this.view = null;
  }
}
