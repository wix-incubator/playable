import View from './top-block.view';

import { ILiveIndicator } from '../live-indicator/types';
import { ITitle } from '../title/types';
import { ITopBlock, ITopBlockViewConfig, ITopBlockViewElements } from './types';

export default class TopBlock implements ITopBlock {
  static moduleName = 'topBlock';
  static View = View;
  static dependencies = ['config', 'title', 'liveIndicator'];

  isHidden: boolean;
  view: View;

  constructor(dependencies) {
    this.isHidden = false;

    this._initUI(this._getElementsNodes(dependencies));
  }

  private _initUI(elementNodes: ITopBlockViewElements) {
    const config: ITopBlockViewConfig = {
      elements: elementNodes,
    };

    this.view = new TopBlock.View(config);
  }

  private _getElementsNodes(dependencies): ITopBlockViewElements {
    const {
      title,
      liveIndicator,
    }: { title: ITitle; liveIndicator: ILiveIndicator } = dependencies;

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
