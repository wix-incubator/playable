import { UIEvent, EngineState } from '../../../constants';

import View from './screen.view';

import playerAPI from '../../../core/player-api-decorator';

import { IEventEmitter } from '../../event-emitter/types';
import { IPlaybackEngine } from '../../playback-engine/types';
import { IPlayerConfig } from '../../../core/config';
import { IRootContainer } from '../../root-container/types';
import { IScreenAPI, IScreen, VideoViewMode, IScreenViewConfig } from './types';

class Screen implements IScreen {
  static moduleName = 'screen';
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config', 'rootContainer'];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;

  private _unbindEvents: () => void;

  view: View;
  isHidden: boolean;

  constructor({
    config,
    eventEmitter,
    engine,
    rootContainer,
  }: {
    config: IPlayerConfig;
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    rootContainer: IRootContainer;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this.isHidden = false;

    this._initUI(config.nativeBrowserControls);
    this._bindEvents();

    rootContainer.appendComponentElement(this.getElement());
  }

  getElement() {
    return this.view.getElement();
  }

  private _initUI(isNativeControls: boolean) {
    const config: IScreenViewConfig = {
      nativeControls: isNativeControls,
      playbackViewElement: this._engine.getElement(),
    };

    this.view = new View(config);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [UIEvent.RESIZE, this._updateSizes],
        [EngineState.SRC_SET, this.view.resetBackground, this.view],
        [EngineState.METADATA_LOADED, this.view.resetAspectRatio, this.view],
      ],
      this,
    );
  }

  private _updateSizes({ width, height }: { width: number; height: number }) {
    this.view.setBackgroundSize(width, height);
    this.view.resetAspectRatio();
  }

  hide() {
    if (!this.isHidden) {
      this.view.hide();
      this.isHidden = true;
    }
  }

  show() {
    if (this.isHidden) {
      this.view.show();
      this.isHidden = false;
    }
  }

  /**
   * Method for setting video view mode.
   * @param viewMode Possible values are "REGULAR", "FILL", "BLUR".
   * With "REGULAR" video tag would try to be fully shown.
   * With "FILL" video tag would fill all space, removing black lines on sides.
   * With "BLUR" black lines would be filled with blured pixels from video.
   * @example
   * player.setVideoViewMode("BLUR");
   */
  @playerAPI()
  setVideoViewMode(viewMode: VideoViewMode) {
    this.view.setViewMode(viewMode);
  }

  destroy() {
    this._unbindEvents();

    this.view.destroy();
  }
}

export { IScreenAPI };
export default Screen;
