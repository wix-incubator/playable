import playerAPI from '../../../core/player-api-decorator';

import { ILiveIndicator } from '../live-indicator/types';
import { ITitle } from '../title/types';
import { ITopBlock, ITopBlockViewConfig, ITopBlockViewElements } from './types';

import View from './top-block.view';
import { ITopButtons } from '../top-buttons/types';

interface IDependencies {
  title: ITitle;
  liveIndicator: ILiveIndicator;
  topButtons: ITopButtons;
}

export default class TopBlock implements ITopBlock {
  static moduleName = 'topBlock';
  static View = View;
  static dependencies = ['title', 'liveIndicator', 'topButtons'];

  private _isBlockFocused: boolean = false;

  isHidden: boolean;
  view: View;

  constructor(dependencies: IDependencies) {
    this.isHidden = false;

    this._bindViewCallbacks();
    this._initUI(this._getElements(dependencies));
  }

  private _bindViewCallbacks() {
    this._setFocusState = this._setFocusState.bind(this);
    this._removeFocusState = this._removeFocusState.bind(this);
  }

  private _initUI(elements: ITopBlockViewElements) {
    const config: ITopBlockViewConfig = {
      elements,
      callbacks: {
        onBlockMouseMove: this._setFocusState,
        onBlockMouseOut: this._removeFocusState,
      },
    };

    this.view = new TopBlock.View(config);
  }

  private _getElements(dependencies: IDependencies): ITopBlockViewElements {
    const { title, liveIndicator, topButtons } = dependencies;

    return {
      title: title.getElement(),
      liveIndicator: liveIndicator.getElement(),
      topButtons: topButtons.getElement(),
    };
  }

  private _setFocusState() {
    this._isBlockFocused = true;
  }

  private _removeFocusState() {
    this._isBlockFocused = false;
  }

  get isFocused() {
    return this._isBlockFocused;
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

  @playerAPI()
  showTitle() {
    this.view.showTitle();
  }

  @playerAPI()
  hideTitle() {
    this.view.hideTitle();
  }

  @playerAPI()
  showLiveIndicator() {
    this.view.showLiveIndicator();
  }

  @playerAPI()
  hideLiveIndicator() {
    this.view.hideLiveIndicator();
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
