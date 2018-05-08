import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';

import playerAPI from '../../../core/player-api-decorator';

import View from './overlay.view';
import { IOverlayViewConfig } from './types';

export default class Overlay {
  static moduleName = 'overlay';
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'config',
    'rootContainer',
    'theme',
  ];

  private _eventEmitter;
  private _engine;
  private _theme;

  view: View;
  isHidden: boolean = false;

  constructor({ config, eventEmitter, engine, rootContainer, theme }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._theme = theme;

    this._bindEvents();
    this._initUI(config.overlay && config.overlay.poster);

    rootContainer.appendComponentNode(this.node);

    if (config.overlay === false) {
      this.hide();
    }
  }

  get node() {
    return this.view.getNode();
  }

  private _initUI(poster) {
    const config: IOverlayViewConfig = {
      callbacks: {
        onPlayClick: this._playVideo,
      },
      src: poster,
      theme: this._theme,
    };

    this.view = new Overlay.View(config);
  }

  private _bindEvents() {
    this._playVideo = this._playVideo.bind(this);

    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._updatePlayingStatus,
      this,
    );
  }

  private _updatePlayingStatus({ nextState }) {
    if (nextState === EngineState.PLAY_REQUESTED) {
      this._hideContent();
    } else if (
      nextState === EngineState.ENDED ||
      (nextState === EngineState.SRC_SET && !this._engine.isPlaying)
    ) {
      this._showContent();
    }
  }

  private _playVideo() {
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

  /**
   * Method for setting overlay poster
   * @param src - Source of image
   * @example
   * player.setPoster('https://example.com/poster.png');
   *
   */
  @playerAPI()
  setPoster(src: string) {
    this.view.setPoster(src);
  }

  private _unbindEvents() {
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
