import get from 'lodash/get';

import { VIDEO_EVENTS, UI_EVENTS } from '../../../constants/index';

import publicAPI from '../../../utils/public-api-decorator';

import View from './loading-cover.view';


export default class LoadingCover {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config', 'controls', 'rootContainer'];

  constructor({ config, eventEmitter, engine, controls, rootContainer }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;
    this._controls = controls;
    this._url = get(config, 'ui.loadingCover');

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this._initUI();
    this.hide();
    this._bindEvents();

    if (get(config, 'ui.loadingCover') !== false) {
      rootContainer.appendComponentNode(this.node);
    }
  }

  get node() {
    return this.view.getNode();
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this._checkForWaitingState, this);
    this._eventEmitter.on(VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide, this);
  }

  _checkForWaitingState({ nextState }) {
    const { STATES } = this._engine;
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
      default: break;
    }
  }

  _initUI() {
    this.view = new View({
      url: this._url
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
      this._controls._hideContent();
      this._eventEmitter.emit(UI_EVENTS.LOADING_COVER_SHOW_TRIGGERED);
      this.view.show();
      this.isHidden = false;
    }
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._checkForWaitingState, this);
    this._eventEmitter.off(VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide, this);
  }

  @publicAPI()
  setLoadingCover(url) {
    this.view.setCover(url);
  }

  destroy() {
    this._unbindEvents();

    this.view.destroy();

    delete this.view;

    delete this._controls;
    delete this._eventEmitter;
    delete this._engine;
  }
}
