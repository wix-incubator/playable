import VIDEO_EVENTS from '../../constants/events/video';

import View from './loader.view';


export default class Loader {
  static View = View;

  constructor({ config, eventEmitter, engine }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._engine = engine;
    this._updateInterval = null;
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
    this._eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this.show);
    this._eventEmitter.on(VIDEO_EVENTS.CAN_PLAY, this.hide);
  }

  _bindCallbacks() {
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this._updateOnInterval = this._updateOnInterval.bind(this);
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

  _updateOnInterval() {
    const readyState = this._engine.getReadyState();

    if (readyState < 3) {
      this.show();
    } else {
      this.hide();
    }
  }

  _startIntervalUpdates() {
    this._updateInterval = setInterval(this._updateOnInterval, 250);
  }

  _stopIntervalUpdates() {
    clearInterval(this._updateInterval);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.SEEK_STARTED, this.show);
    this._eventEmitter.off(VIDEO_EVENTS.CAN_PLAY, this.hide);
  }

  destroy() {
    this._stopIntervalUpdates();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this.eventEmitter;
    delete this._engine;
  }
}
