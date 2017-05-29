import VIDEO_EVENTS from '../../constants/events/video';

import View from './loader.view';


export default class Loader {
  static View = View;

  constructor({ config, eventEmitter, engine }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;
    this._updateInterval = null;
    this._delayedUpdateTimeout = null;
    this.config = {
      ...config
    };

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();

    this.hide();
    this._startIntervalUpdates();
  }

  get node() {
    return this.view.getNode();
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._setDelayedUpdate, this);
    this._eventEmitter.on(VIDEO_EVENTS.CAN_PLAY, this.hide, this);
  }

  _bindCallbacks() {
    this._startIntervalUpdates = this._startIntervalUpdates.bind(this);
    this._updateState = this._updateState.bind(this);
  }

  _stopUpdateWhileSeek() {
    this.hide();
    this._stopIntervalUpdates();
  }

  _startUpdateAfterSeek() {
    this._updateState();
    this._startIntervalUpdates();
  }

  _initUI() {
    const { view } = this.config;

    if (view) {
      this.view = new view();
    } else {
      this.view = new Loader.View();
    }
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

  _updateState() {
    const readyState = this._engine.getReadyState();

    if (readyState < 3) {
      this.show();
    } else {
      this.hide();
    }
  }

  _setDelayedUpdate() {
    this._stopIntervalUpdates();
    this._delayedUpdateTimeout = setTimeout(this._startIntervalUpdates, 100);
  }

  _clearDelayedUpdate() {
    clearTimeout(this._delayedUpdateTimeout);
    this._delayedUpdateTimeout = null;
  }

  _startIntervalUpdates() {
    this._updateInterval = setInterval(this._updateState, 250);
  }

  _stopIntervalUpdates() {
    clearInterval(this._updateInterval);
    this._updateInterval = null;
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.SEEK_STARTED, this._setDelayedUpdate, this);
    this._eventEmitter.off(VIDEO_EVENTS.CAN_PLAY, this.hide, this);
  }

  destroy() {
    this._stopIntervalUpdates();
    this._clearDelayedUpdate();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
  }
}
