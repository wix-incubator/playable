import playerAPI from '../../../core/player-api-decorator';

import View from './bottom-block.view';
import { UI_EVENTS } from '../../../constants';

import { IEventEmitter } from '../../event-emitter/types';
import { IPlayControl } from '../controls/play/types';
import { ITimeControl } from '../controls/time/types';
import { IProgressControl } from '../controls/progress/types';
import { IVolumeControl } from '../controls/volume/types';
import { IFullScreenControl } from '../controls/full-screen/types';
import { ILogoControl, ILogoConfig } from '../controls/logo/types';
import { IDownloadButton } from '../controls/download/types';

import {
  IBottomBlock,
  IBottomBlockViewConfig,
  IBottomBlockViewElements,
} from './types';
import { IPlayerConfig } from '../../../core/config';

interface IDependencies {
  config: IPlayerConfig;
  eventEmitter: IEventEmitter;
  playControl: IPlayControl;
  progressControl: IProgressControl;
  timeControl: ITimeControl;
  volumeControl: IVolumeControl;
  fullScreenControl: IFullScreenControl;
  logo: ILogoControl;
  downloadButton: IDownloadButton;
}

export default class BottomBlock implements IBottomBlock {
  static moduleName = 'bottomBlock';
  static View = View;
  static dependencies = [
    'config',
    'playControl',
    'progressControl',
    'timeControl',
    'volumeControl',
    'fullScreenControl',
    'logo',
    'downloadButton',
    'eventEmitter',
  ];

  private _eventEmitter: IEventEmitter;

  private _isBlockFocused: boolean = false;

  private _unbindEvents: Function;

  view: View;
  isHidden: boolean = false;

  constructor(dependencies: IDependencies) {
    const { config, eventEmitter } = dependencies;
    this._eventEmitter = eventEmitter;

    this._bindViewCallbacks();
    this._initUI(this._getElementsNodes(dependencies));
    this._initLogo(config.logo);
    this._bindEvents();
  }

  private _getElementsNodes(
    dependencies: IDependencies,
  ): IBottomBlockViewElements {
    const {
      playControl,
      progressControl,
      timeControl,
      volumeControl,
      fullScreenControl,
      logo,
      downloadButton,
    } = dependencies;

    return {
      play: playControl.node,
      progress: progressControl.node,
      time: timeControl.node,
      volume: volumeControl.node,
      fullScreen: fullScreenControl.node,
      download: downloadButton.node,
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
    this.hideDownloadButton();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [[UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._removeFocusState]],
      this,
    );
  }

  private _initLogo(logoConfig: ILogoConfig | boolean) {
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
    this.view.showContent();
  }

  hideContent() {
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
   * Method for showing download button.
   * @example
   * player.showDownloadButton();
   */
  @playerAPI()
  showDownloadButton() {
    this.view.showDownloadButton();
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

  /**
   * Method for hidding download button.
   * @example
   * player.hideDownloadButton();
   */
  @playerAPI()
  hideDownloadButton() {
    this.view.hideDownloadButton();
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();

    this.view = null;
    this._eventEmitter = null;
  }
}
