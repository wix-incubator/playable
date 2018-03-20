import playerAPI from '../../../utils/player-api-decorator';

import { IBottomBlockViewConfig, IBottomBlockViewElements } from './types';

import View from './bottom-block.view';

export default class BottomBlock {
  static moduleName = 'bottomBlock';
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

  private _getElementsNodes(dependencies): IBottomBlockViewElements {
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

  private _initUI(elementNodes: IBottomBlockViewElements) {
    const config: IBottomBlockViewConfig = {
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
   * @param flag - `true` for showing always
   * @example
   * player.setLogoAlwaysShowFlag(true);
   *
   */
  @playerAPI()
  setLogoAlwaysShowFlag(flag: boolean) {
    this.view.setShouldLogoShowAlwaysFlag(flag);
  }

  /**
   * Method for hidding logo. If you use `setLogoAlwaysShowFlag` or `setControlsShouldAlwaysShow`, logo would automaticaly appear.
   * @example
   * player.hideLogo();
   */
  @playerAPI()
  hideLogo() {
    this.view.hideLogo();
  }

  /**
   * Method for showing logo.
   * @example
   * player.showLogo();
   */
  @playerAPI()
  showLogo() {
    this.view.showLogo();
  }

  /**
   * Method for showing play control.
   * @example
   * player.showPlayControl();
   */
  @playerAPI()
  showPlayControl() {
    this.view.showPlayControl();
  }

  /**
   * Method for showing volume control.
   * @example
   * player.showVolumeControl();
   */
  @playerAPI()
  showVolumeControl() {
    this.view.showVolumeControl();
  }

  /**
   * Method for showing time control.
   * @example
   * player.showTimeControl();
   */
  @playerAPI()
  showTimeControl() {
    this.view.showTimeControl();
  }

  /**
   * Method for showing full screen control.
   * @example
   * player.showFullScreenControl();
   */
  @playerAPI()
  showFullScreenControl() {
    this.view.showFullScreenControl();
  }

  /**
   * Method for showing progress control.
   * @example
   * player.showProgressControl();
   */
  @playerAPI()
  showProgressControl() {
    this.view.showProgressControl();
  }

  /**
   * Method for hidding play control.
   * @example
   * player.hidePlayControl();
   */
  @playerAPI()
  hidePlayControl() {
    this.view.hidePlayControl();
  }

  /**
   * Method for hidding voluem control.
   * @example
   * player.hideVolumeControl();
   */
  @playerAPI()
  hideVolumeControl() {
    this.view.hideVolumeControl();
  }

  /**
   * Method for hidding time control.
   * @example
   * player.hideTimeControl();
   */
  @playerAPI()
  hideTimeControl() {
    this.view.hideTimeControl();
  }

  /**
   * Method for hidding full screen control.
   * @example
   * player.hideFullScreenControl();
   */
  @playerAPI()
  hideFullScreenControl() {
    this.view.hideFullScreenControl();
  }

  /**
   * Method for hidding progress control.
   * @example
   * player.hideProgressControl();
   */
  @playerAPI()
  hideProgressControl() {
    this.view.hideProgressControl();
  }

  destroy() {
    this.view.destroy();
    delete this.view;

    delete this._screen;
  }
}
