import VIDEO_EVENTS from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import View from './loading-cover.view';


export default class LoadingCover {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config', 'controls'];

  constructor({ config, eventEmitter, engine, controls }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;
    this._controls = controls;
    this.config = {
      ...config.ui.loadingCover
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this._initUI();
    this.hide();
    this._bindEvents();
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

      default: break;
    }
  }

  _initUI() {
    const { url } = this.config;

    this.view = new View({
      url
    });
  }

  hide() {
    if (!this.isHidden) {
      this._eventEmitter.emit(UI_EVENTS.LOADER_HIDE_TRIGGERED);
      this.view.hide();
      this.isHidden = true;
    }
  }

  show() {
    if (this.isHidden) {
      this._controls._hideContent();
      this._eventEmitter.emit(UI_EVENTS.LOADER_SHOW_TRIGGERED);
      this.view.show();
      this.isHidden = false;
    }
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._checkForWaitingState, this);
    this._eventEmitter.off(VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide, this);
  }

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
