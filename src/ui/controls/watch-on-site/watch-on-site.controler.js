import View from './watch-on-site.view';


export default class FullScreenControl {
  static View = View;
  static dependencies = ['engine', 'config'];

  constructor({ engine, config }) {
    this._config = {
      ...config.ui.controls.watchOnSite
    };

    this._engine = engine;

    this._bindCallbacks();

    this._initUI();
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._triggerWatchOnSite = this._triggerWatchOnSite.bind(this);
  }

  _initUI() {
    const config = {
      callbacks: {
        onWatchOnSiteClick: this._triggerWatchOnSite
      },
      logo: this._config.logo
    };

    this.view = new this.constructor.View(config);
  }

  _triggerWatchOnSite() {
    if (this._config.url) {
      this._engine.pause();
      window.open(this._config.url, '_blank');
    }
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  destroy() {
    this.view.destroy();
    delete this.view;

    delete this._engine;

    delete this.isHidden;
  }
}
