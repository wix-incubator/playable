import { isSafari } from '../../utils/device-detection';
import playerAPI from '../../core/player-api-decorator';
import ChromePictureInPicture from './chrome';
import SafariPictureInPicture from './safari';

import { UI_EVENTS } from '../../constants';
import { IPictureInPicture, IPictureInPictureHelper } from './types';
import { IEventEmitter } from '../event-emitter/types';
import { IPlaybackEngine } from '../playback-engine/types';

export default class PictureInPicture implements IPictureInPicture {
  static moduleName = 'pictureInPicture';
  static dependencies = ['eventEmitter', 'engine', 'config'];

  private _eventEmitter: IEventEmitter;
  private _helper: IPictureInPictureHelper;

  private _isEnabled: boolean = true;

  constructor({
    eventEmitter,
    engine,
  }: {
    engine: IPlaybackEngine;
    eventEmitter: IEventEmitter;
  }) {
    this._eventEmitter = eventEmitter;

    this._onChange = this._onChange.bind(this);

    if (isSafari()) {
      this._helper = new SafariPictureInPicture(
        engine.getElement(),
        this._onChange,
      );
    } else {
      this._helper = new ChromePictureInPicture(
        engine.getElement(),
        this._onChange,
      );
    }
  }

  private _onChange() {
    this._eventEmitter.emit(
      UI_EVENTS.PICTURE_IN_PICTURE_STATUS_CHANGE,
      this.isInPictureInPicture,
    );
  }

  /**
   * Player would try to enter fullscreen mode.
   * Behavior of fullscreen mode on different platforms may differ.
   * @example
   * player.enterFullScreen();
   */
  @playerAPI()
  enterPictureInPicture() {
    if (!this.isEnabled) {
      return;
    }

    this._helper.request();
  }

  /**
   * Player would try to exit fullscreen mode.
   * @example
   * player.exitFullScreen();
   */
  @playerAPI()
  exitPictureInPicture() {
    if (!this.isEnabled) {
      return;
    }

    this._helper.exit();
  }

  /**
   * Disable functionality for entering picture in picture mode
   */
  @playerAPI()
  disablePictureInPicture() {
    this._helper.exit();
    this._isEnabled = false;
  }

  /**
   * Enable functionality for entering picture in picture mode
   */
  @playerAPI()
  enablePictureInPicture() {
    this._isEnabled = true;
  }

  /**
   * Return true if player is in full screen
   * @example
   * console.log(player.isInFullScreen); // false
   */
  @playerAPI()
  get isInPictureInPicture(): boolean {
    if (!this.isEnabled) {
      return false;
    }

    return this._helper.isInPictureInPicture;
  }

  get isEnabled() {
    return this._helper.isEnabled && this._isEnabled;
  }

  destroy() {
    this._helper.destroy();
  }
}
