import get from 'lodash/get';

import { VIDEO_EVENTS, UI_EVENTS } from '../../../constants/index';


import View from './loader.view';


const DELAY_FOR_SHOW_ON_WAITING_STATE = 100;

export default class Loader {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config'];

  constructor({ config, eventEmitter, engine }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;
    this.config = {
      ...get(config, 'ui.loader')
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this._initUI();
    this._bindEvents();
    this.hide();
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
      case STATES.SEEK_IN_PROGRESS:
        this._startDelayedShow();
        break;
      case STATES.WAITING:
        this._startDelayedShow();
        break;
      case STATES.LOAD_STARTED:
        if (this._engine.isPreloadAvailable) {
          this.show();
        }
        break;
      case STATES.READY_TO_PLAY:
        this._stopDelayedShow();
        this.hide();
        break;
      case STATES.PLAYING:
        this._stopDelayedShow();
        this.hide();
        break;
      case STATES.PAUSED:
        this._stopDelayedShow();
        this.hide();
        break;

      default: break;
    }
  }

  _initUI() {
    const { view } = this.config;

    if (view) {
      this.view = new view();
    } else {
      this.view = new this.constructor.View();
    }
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
      this._eventEmitter.emit(UI_EVENTS.LOADER_SHOW_TRIGGERED);
      this.view.show();
      this.isHidden = false;
    }
  }

  _startDelayedShow() {
    this._stopDelayedShow();
    this._delayedShowTimeout = setTimeout(this.show, DELAY_FOR_SHOW_ON_WAITING_STATE);
  }

  _stopDelayedShow() {
    clearTimeout(this._delayedShowTimeout);
    this._delayedShowTimeout = null;
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._checkForWaitingState, this);
    this._eventEmitter.off(VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide, this);
  }

  destroy() {
    this._unbindEvents();
    this._stopDelayedShow();

    this.view.destroy();

    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
  }
}
