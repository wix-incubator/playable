import playerAPI from '../../../core/player-api-decorator';

import View from './bottom-block.view';
import { UIEvent } from '../../../constants';

import { IEventEmitter } from '../../event-emitter/types';
import { IPlayControl } from '../controls/play/types';
import { ITimeControl } from '../controls/time/types';
import { IProgressControl } from '../controls/progress/types';
import { IVolumeControl } from '../controls/volume/types';
import { IFullScreenControl } from '../controls/full-screen/types';
import { ILogoControl } from '../controls/logo/types';
import { IDownloadButton } from '../controls/download/types';
import { IChromecastButton } from '../controls/chromecast/types';
import { IPictureInPictureControl } from '../controls/picture-in-picture/types';

import {
  IBottomBlockAPI,
  IBottomBlock,
  IBottomBlockViewConfig,
  IBottomBlockViewElements,
} from './types';

interface IDependencies {
  eventEmitter: IEventEmitter;
  playControl: IPlayControl;
  progressControl: IProgressControl;
  timeControl: ITimeControl;
  volumeControl: IVolumeControl;
  fullScreenControl: IFullScreenControl;
  logo: ILogoControl;
  downloadButton: IDownloadButton;
  chromecastButton: IChromecastButton;
  pictureInPictureControl: IPictureInPictureControl;
}

interface IAddControllOptions {
  position?: 'left' | 'right';
}

class BottomBlock implements IBottomBlock {
  static moduleName = 'bottomBlock';
  static View = View;
  static dependencies = [
    'playControl',
    'progressControl',
    'timeControl',
    'volumeControl',
    'fullScreenControl',
    'logo',
    'downloadButton',
    'eventEmitter',
    'pictureInPictureControl',
  ];

  private _eventEmitter: IEventEmitter;

  private _isBlockFocused: boolean = false;

  private _unbindEvents: () => void;

  view: View;
  isHidden: boolean = false;

  constructor(dependencies: IDependencies) {
    const { eventEmitter } = dependencies;
    this._eventEmitter = eventEmitter;

    this._bindViewCallbacks();
    this._initUI(this._getControlElements(dependencies));
    this._bindEvents();
  }

  private _getControlElements(
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
      pictureInPictureControl,
    } = dependencies;

    return {
      play: playControl.getElement(),
      progress: progressControl.getElement(),
      time: timeControl.getElement(),
      volume: volumeControl.getElement(),
      fullScreen: fullScreenControl.getElement(),
      download: downloadButton.getElement(),
      logo: logo.getElement(),
      pictureInPicture: pictureInPictureControl.getElement(),
    };
  }

  getElement() {
    return this.view.getElement();
  }

  addControl(key: string, element: HTMLElement, options?: IAddControllOptions) {
    const { position = 'right' } = options || {};
    this.view.addControl(key, element, position);
  }

  private _initUI(elements: IBottomBlockViewElements) {
    const config: IBottomBlockViewConfig = {
      elements,
      callbacks: {
        onBlockMouseMove: this._setFocusState,
        onBlockMouseOut: this._removeFocusState,
      },
    };

    this.view = new BottomBlock.View(config);
    this.hideLogo();
    this.hideDownloadButton();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [[UIEvent.FULL_SCREEN_STATE_CHANGED, this._removeFocusState]],
      this,
    );
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
   * player.setAlwaysShowLogo(true);
   *
   */
  @playerAPI()
  setAlwaysShowLogo(flag: boolean) {
    this.view.setShouldLogoShowAlwaysFlag(flag);
  }

  /**
   * Method for hiding logo. If you use `setAlwaysShowLogo` or `setControlsShouldAlwaysShow`, logo would automaticaly appear.
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
   * Method for showing picture-in-picture control.
   * @example
   * player.showPictureInPictureControl();
   */
  @playerAPI()
  showPictureInPictureControl() {
    this.view.showPictureInPictureControl();
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
   * Method for hiding play control.
   * @example
   * player.hidePlayControl();
   */
  @playerAPI()
  hidePlayControl() {
    this.view.hidePlayControl();
  }

  /**
   * Method for hiding voluem control.
   * @example
   * player.hideVolumeControl();
   */
  @playerAPI()
  hideVolumeControl() {
    this.view.hideVolumeControl();
  }

  /**
   * Method for hiding time control.
   * @example
   * player.hideTimeControl();
   */
  @playerAPI()
  hideTimeControl() {
    this.view.hideTimeControl();
  }

  /**
   * Method for hiding full screen control.
   * @example
   * player.hideFullScreenControl();
   */
  @playerAPI()
  hideFullScreenControl() {
    this.view.hideFullScreenControl();
  }

  /**
   * Method for hiding picture-in-picture control.
   * @example
   * player.hidePictureInPictureControl();
   */
  @playerAPI()
  hidePictureInPictureControl() {
    this.view.hidePictureInPictureControl();
  }

  /**
   * Method for hiding progress control.
   * @example
   * player.hideProgressControl();
   */
  @playerAPI()
  hideProgressControl() {
    this.view.hideProgressControl();
  }

  /**
   * Method for hiding download button.
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
  }
}

export { IBottomBlockAPI };
export default BottomBlock;
