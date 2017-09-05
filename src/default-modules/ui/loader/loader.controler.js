import get from 'lodash/get';

import { VIDEO_EVENTS, UI_EVENTS } from '../../../constants/index';


import View from './loader.view';


export const DELAYED_SHOW_TIMEOUT = 100;

export default class Loader {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config', 'rootContainer'];

  constructor({ config, eventEmitter, engine, rootContainer }) {
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

    if (get(config, 'ui.loader') !== false) {
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
      case STATES.SEEK_IN_PROGRESS:
        this.startDelayedShow();
        break;
      case STATES.WAITING:
        this.startDelayedShow();
        break;
      case STATES.LOAD_STARTED:
        if (this._engine.isPreloadAvailable) {
          this.show();
        }
        break;
      case STATES.READY_TO_PLAY:
        this.stopDelayedShow();
        this.hide();
        break;
      case STATES.PLAYING:
        this.stopDelayedShow();
        this.hide();
        break;
      case STATES.PAUSED:
        this.stopDelayedShow();
        this.hide();
        break;

      /* ignore coverage */
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

  startDelayedShow() {
    if (this.isDelayedShowScheduled) {
      this.stopDelayedShow();
    }
    this._delayedShowTimeout = setTimeout(this.show, DELAYED_SHOW_TIMEOUT);
  }

  stopDelayedShow() {
    clearTimeout(this._delayedShowTimeout);
    this._delayedShowTimeout = null;
  }

  get isDelayedShowScheduled() {
    return Boolean(this._delayedShowTimeout);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._checkForWaitingState, this);
    this._eventEmitter.off(VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide, this);
  }

  destroy() {
    this._unbindEvents();
    this.stopDelayedShow();

    this.view.destroy();

    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
  }
}
