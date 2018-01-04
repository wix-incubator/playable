import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../constants/index';

import playerAPI from '../../../utils/player-api-decorator';

import View from './loading-cover.view';

export default class LoadingCover {
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'config',
    'bottomBlock',
    'rootContainer',
  ];

  private _eventEmitter;
  private _engine;
  private _bottomBlock;
  private _url;

  view: View;
  isHidden: boolean;

  constructor({ config, eventEmitter, engine, bottomBlock, rootContainer }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;
    this._bottomBlock = bottomBlock;
    this._url = config.loadingCover;

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this._initUI();
    this.hide();
    this._bindEvents();

    if (this._url !== false) {
      rootContainer.appendComponentNode(this.node);
    }
  }

  get node() {
    return this.view.getNode();
  }

  _bindEvents() {
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._checkForWaitingState,
      this,
    );
    this._eventEmitter.on(VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide, this);
  }

  _checkForWaitingState({ nextState }) {
    switch (nextState) {
      case STATES.LOAD_STARTED:
        if (this._engine.isPreloadAvailable) {
          this.show();
        }
        break;
      case STATES.WAITING:
        if (!this._engine.isMetadataLoaded) {
          this.show();
        }
        break;
      case STATES.READY_TO_PLAY:
        this.hide();
        break;

      /* ignore coverage */
      default:
        break;
    }
  }

  _initUI() {
    this.view = new View({
      url: this._url,
    });
  }

  hide() {
    if (!this.isHidden) {
      this._eventEmitter.emit(UI_EVENTS.LOADING_COVER_HIDE_TRIGGERED);
      this.view.hide();
      this.isHidden = true;
    }
  }

  show() {
    if (this.isHidden) {
      this._bottomBlock.hideContent();
      this._eventEmitter.emit(UI_EVENTS.LOADING_COVER_SHOW_TRIGGERED);
      this.view.show();
      this.isHidden = false;
    }
  }

  _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._checkForWaitingState,
      this,
    );
    this._eventEmitter.off(VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide, this);
  }

  /**
   * Method for setting source of image, that would be used as loading cover instead of loader.
   *
   * @param src - Link to your image
   *
   * @example
   * const src = 'link.to.your.image'
   * player.setLoadingCover(src);
   *
   */
  @playerAPI()
  setLoadingCover(src: string) {
    this.view.setCover(src);
  }

  destroy() {
    this._unbindEvents();

    this.view.destroy();

    delete this.view;

    delete this._bottomBlock;
    delete this._eventEmitter;
    delete this._engine;
  }
}
