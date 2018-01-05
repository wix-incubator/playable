import * as get from 'lodash/get';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../constants/index';

import View from './overlay.view';

export interface IOverlayConfig {
  poster?: string;
}

export default class Overlay {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config', 'rootContainer'];

  private _eventEmitter;
  private _engine;

  view: View;
  isHidden: boolean = false;

  constructor({ config, eventEmitter, engine, rootContainer }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this._bindEvents();
    this._initUI(config.overlay);

    rootContainer.appendComponentNode(this.node);

    if (config.overlay === false) {
      this.hide();
    }
  }

  get node() {
    return this.view.getNode();
  }

  _initUI(config) {
    const params = {
      callbacks: {
        onPlayClick: this._playVideo,
      },
      src: get(config, 'poster'),
    };

    const customView = get(config, 'view');

    if (customView) {
      this.view = new customView(params);
    } else {
      this.view = new Overlay.View(params);
    }
  }

  _bindEvents() {
    this._playVideo = this._playVideo.bind(this);

    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._updatePlayingStatus,
      this,
    );
  }

  _updatePlayingStatus({ nextState }) {
    if (nextState === STATES.PLAY_REQUESTED) {
      this._hideContent();
    } else if (nextState === STATES.ENDED) {
      this._showContent();
    }
  }

  _playVideo() {
    this._engine.play();

    this._eventEmitter.emit(UI_EVENTS.PLAY_OVERLAY_TRIGGERED);
  }

  private _hideContent() {
    this.view.hideContent();
  }

  private _showContent() {
    this.view.showContent();
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  setPoster(src) {
    this.view.setPoster(src);
  }

  _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._updatePlayingStatus,
      this,
    );
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
  }
}
