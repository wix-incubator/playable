import View from './top-block.view';

export default class TopBlock {
  static View = View;
  static dependencies = [
    'config',
    'screen',
    'title',
    'liveIndicator',
  ];

  private _screen;

  isHidden: boolean;
  view: View;

  constructor(dependencies) {
    const { screen } = dependencies;

    this._screen = screen;
    this.isHidden = false;

    this._initUI(this._getElementsNodes(dependencies));
  }

  private _initUI(elementNodes) {
    const config = {
      elements: elementNodes,
    };

    this.view = new TopBlock.View(config);
  }

  private _getElementsNodes(dependencies) {
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
    this._screen.showTopShadow();

    this.view.showContent();
  }

  hideContent() {
    this._screen.hideTopShadow();

    this.view.hideContent();
  }

  destroy() {
    delete this._screen;
  }
}
