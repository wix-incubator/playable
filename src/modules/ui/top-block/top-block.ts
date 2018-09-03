import View from './top-block.view';

import { ILiveIndicator } from '../live-indicator/types';
import { ITitle } from '../title/types';
import { ITopBlock, ITopBlockViewConfig, ITopBlockViewElements } from './types';

interface IDependencies {
  title: ITitle;
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

    this._initUI(this._getElements(dependencies));
  }

  private _initUI(elements: ITopBlockViewElements) {
    const config: ITopBlockViewConfig = {
      elements,
    };

    this.view = new TopBlock.View(config);
  }

  private _getElements(dependencies: IDependencies): ITopBlockViewElements {
    const { title, liveIndicator } = dependencies;

    return {
      title: title.getElement(),
      liveIndicator: liveIndicator.getElement(),
    };
  }

  getElement() {
    return this.view.getElement();
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
