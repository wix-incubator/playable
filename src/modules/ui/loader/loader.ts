import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';

import View from './loader.view';

export const DELAYED_SHOW_TIMEOUT = 100;

export default class Loader {
  static moduleName = 'loader';
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config', 'rootContainer'];

  private _eventEmitter;
  private _engine;

  private _delayedShowTimeout;

  view: View;
  isHidden: boolean;

  constructor({ config, eventEmitter, engine, rootContainer }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;

    this._bindCallbacks();

    this._initUI();
    this._bindEvents();
    this._hideContent();

    rootContainer.appendComponentNode(this.node);

    if (config.loader === false) {
      this.hide();
    }
  }

  get node() {
    return this.view.getNode();
  }

  private _bindCallbacks() {
    this._showContent = this._showContent.bind(this);
    this._hideContent = this._hideContent.bind(this);
  }

  private _bindEvents() {
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._checkForWaitingState,
      this,
    );
    this._eventEmitter.on(VIDEO_EVENTS.UPLOAD_SUSPEND, this.hide, this);
  }

  private _checkForWaitingState({ nextState }) {
    switch (nextState) {
      case EngineState.SEEK_IN_PROGRESS:
        this.startDelayedShow();
        break;
      case EngineState.WAITING:
        this.startDelayedShow();
        break;
      case EngineState.LOAD_STARTED:
        if (this._engine.isPreloadAvailable) {
          this._showContent();
        }
        break;
      case EngineState.READY_TO_PLAY:
        this.stopDelayedShow();
        this._hideContent();
        break;
      case EngineState.PLAYING:
        this.stopDelayedShow();
        this._hideContent();
        break;
      case EngineState.PAUSED:
        this.stopDelayedShow();
        this._hideContent();
        break;

      /* ignore coverage */
      default:
        break;
    }
  }

  private _initUI() {
    this.view = new Loader.View();
  }

  private _showContent() {
    if (this.isHidden) {
      this._eventEmitter.emit(UI_EVENTS.LOADER_SHOW_TRIGGERED);
      this.view.showContent();
      this.isHidden = false;
    }
  }

  private _hideContent() {
    if (!this.isHidden) {
      this._eventEmitter.emit(UI_EVENTS.LOADER_HIDE_TRIGGERED);
      this.view.hideContent();
      this.isHidden = true;
    }
  }

  hide() {
    this.view.hide();
  }

  show() {
    this.view.show();
  }

  startDelayedShow() {
    if (this.isDelayedShowScheduled) {
      this.stopDelayedShow();
    }
    this._delayedShowTimeout = setTimeout(
      this._showContent,
      DELAYED_SHOW_TIMEOUT,
    );
  }

  stopDelayedShow() {
    clearTimeout(this._delayedShowTimeout);
    this._delayedShowTimeout = null;
  }

  get isDelayedShowScheduled() {
    return Boolean(this._delayedShowTimeout);
  }

  private _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._checkForWaitingState,
      this,
    );
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