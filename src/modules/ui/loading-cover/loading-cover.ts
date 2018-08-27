import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';

import playerAPI from '../../../core/player-api-decorator';

import View from './loading-cover.view';
import { IEventEmitter } from '../../event-emitter/types';
import { IPlaybackEngine } from '../../playback-engine/types';
import { IBottomBlock } from '../bottom-block/types';
import { ILoadingCover } from './types';
import { IRootContainer } from '../../root-container/types';

export default class LoadingCover implements ILoadingCover {
  static moduleName = 'loadingCover';
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'bottomBlock',
    'rootContainer',
  ];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _bottomBlock: IBottomBlock;

  private _unbindEvents: Function;

  view: View;
  isHidden: boolean;

  constructor({
    eventEmitter,
    engine,
    bottomBlock,
    rootContainer,
  }: {
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    bottomBlock: IBottomBlock;
    rootContainer: IRootContainer;
  }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;
    this._bottomBlock = bottomBlock;

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this._initUI();
    this._bindEvents();

    rootContainer.appendComponentElement(this.getElement());
    this.hide();
  }

  getElement() {
    return this.view.getElement();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [VIDEO_EVENTS.STATE_CHANGED, this._checkForWaitingState],
        [VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide],
      ],
      this,
    );
  }

  private _checkForWaitingState({ nextState }: { nextState: EngineState }) {
    switch (nextState) {
      case EngineState.LOAD_STARTED:
        if (this._engine.isPreloadAvailable) {
          this.show();
        }
        break;
      case EngineState.WAITING:
        if (!this._engine.isMetadataLoaded) {
          this.show();
        }
        break;
      case EngineState.READY_TO_PLAY:
        this.hide();
        break;

      /* ignore coverage */
      default:
        break;
    }
  }

  private _initUI() {
    this.view = new View();
  }

  hide() {
    if (!this.isHidden) {
      this._eventEmitter.emit(UI_EVENTS.LOADING_COVER_HIDE);
      this.view.hide();
      this.isHidden = true;
    }
  }

  show() {
    if (this.isHidden) {
      this._bottomBlock.hideContent();
      this._eventEmitter.emit(UI_EVENTS.LOADING_COVER_SHOW);
      this.view.show();
      this.isHidden = false;
    }
  }

  /**
   * Method for setting source of image, that would be used as loading cover instead of loader.
   * @param src - Link to your image
   * @example
   * player.setLoadingCover('https://example.com/cover.png');
   *
   */
  @playerAPI()
  setLoadingCover(src: string) {
    this.view.setCover(src);
  }

  destroy() {
    this._unbindEvents();

    this.view.destroy();

    this.view = null;

    this._bottomBlock = null;
    this._eventEmitter = null;
    this._engine = null;
  }
}
