import playerAPI from '../../../utils/player-api-decorator';

import View from './bottom-block.view';

export default class BottomBlock {
  static View = View;
  static dependencies = [
    'config',
    'screen',
    'playControl',
    'progressControl',
    'timeControl',
    'volumeControl',
    'fullScreenControl',
    'logo',
  ];

  private _screen;

  private _isBlockFocused: boolean = false;

  view: View;
  isHidden: boolean = false;

  constructor(dependencies) {
    const { config, screen } = dependencies;
    this._screen = screen;

    this._bindViewCallbacks();
    this._initUI(this._getElementsNodes(dependencies));
    this._initLogo(config.logo);
  }

  private _getElementsNodes(dependencies) {
    const {
      playControl,
      progressControl,
      timeControl,
      volumeControl,
      fullScreenControl,
      logo,
    } = dependencies;

    return {
      play: playControl.node,
      progress: progressControl.node,
      time: timeControl.node,
      volume: volumeControl.node,
      fullScreen: fullScreenControl.node,
      logo: logo.node,
    };
  }

  get node() {
    return this.view.getNode();
  }

  private _initUI(elementNodes) {
    const config = {
      elements: elementNodes,
      callbacks: {
        onBlockMouseMove: this._setFocusState,
        onBlockMouseOut: this._removeFocusState,
      },
    };

    this.view = new BottomBlock.View(config);
  }

  private _initLogo(logoConfig) {
    if (logoConfig) {
      if (typeof logoConfig === 'object') {
        this.setLogoAlwaysShowFlag(logoConfig.showAlways);
      }
    } else {
      this.hideLogo();
    }
  }

  private _bindViewCallbacks() {
    this._setFocusState = this._setFocusState.bind(this);
    this._removeFocusState = this._removeFocusState.bind(this);
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

  showContent() {
    this._screen.showBottomShadow();
    this.view.showContent();
  }

  hideContent() {
    this._screen.hideBottomShadow();
    this.view.hideContent();
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  /**
   * Method for allowing logo to be always shown in bottom block
   *
   * @param flag: True for showing always
   *
   */
  @playerAPI()
  setLogoAlwaysShowFlag(flag: boolean) {
    this.view.setShouldLogoShowAlwaysFlag(flag);
  }

  /**
   * Method for hidding logo. If you use `setLogoAlwaysShowFlag` or `setControlsShouldAlwaysShow`, logo would automaticaly appear.
   */
  @playerAPI()
  hideLogo() {
    this.view.hideLogo();
  }

  destroy() {
    this.view.destroy();
    delete this.view;

    delete this._screen;
  }
}
