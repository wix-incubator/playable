import get from 'lodash/get';

import { UI_EVENTS, TEXT_LABELS } from '../../../../constants/index';
import View from './watch-on-site.view';


export default class FullScreenControl {
  static View = View;
  static dependencies = ['engine', 'config', 'eventEmitter', 'textMap'];

  constructor({ engine, eventEmitter, config, textMap }) {
    this._config = {
      ...get(config, 'ui.controls.watchOnSite')
    };

    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._textMap = textMap;

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
      tooltip: this._textMap.get(TEXT_LABELS.WATCH_ON_SITE_TOOLTIP),
      logo: this._config.logo
    };

    this.view = new this.constructor.View(config);
  }

  _triggerWatchOnSite() {
    this._eventEmitter.emit(UI_EVENTS.WATCH_ON_SITE_TRIGGERED);
  }

  setLogo(url) {
    this.view.setLogo(url);
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
    delete this._eventEmitter;
    delete this._textMap;

    delete this.isHidden;
  }
}
