import View from './loader.view';


export default class Loader {
  static View = View;

  constructor({ config, eventEmitter, vidi }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;
    this._vidi = vidi;
    this._updateInterval = null;
    this.config = {
      ...config
    };

    this._bindCallbacks();
    this._initUI();

    this.hide();
    this._startIntervalUpdates();
  }

  get node() {
    return this.view.getNode();
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
    const video = this._vidi.getVideoElement();

    if (!video) {
      return;
    }

    if (video.readyState < 3) {
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

  destroy() {
    this._stopIntervalUpdates();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this.eventEmitter;
    delete this.vidi;
  }
}
