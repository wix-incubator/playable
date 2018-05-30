import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';

import playerAPI from '../../../core/player-api-decorator';

import View from './overlay.view';
import { IOverlay, IOverlayConfig, IOverlayViewConfig } from './types';
import { IEventEmitter } from '../../event-emitter/types';
import { IPlaybackEngine } from '../../playback-engine/types';
import { IThemeService } from '../core/theme';
import { IPlayerConfig } from '../../../core/config';
import { IRootContainer } from '../../root-container/types';

export default class Overlay implements IOverlay {
  static moduleName = 'overlay';
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'config',
    'rootContainer',
    'theme',
  ];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _theme: IThemeService;

  private _unbindEvents: Function;

  view: View;
  isHidden: boolean = false;

  constructor({
    config,
    eventEmitter,
    engine,
    rootContainer,
    theme,
  }: {
    config: IPlayerConfig;
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    rootContainer: IRootContainer;
    theme: IThemeService;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._theme = theme;

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

  private _initUI(overlayConfig: IOverlayConfig | boolean) {
    const poster: string =
      typeof overlayConfig === 'object' ? overlayConfig.poster : null;
    const viewConfig: IOverlayViewConfig = {
      callbacks: {
        onPlayClick: this._playVideo.bind(this),
      },
      src: poster,
      theme: this._theme,
    };

    this.view = new Overlay.View(viewConfig);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [[VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus]],
      this,
    );
  }

  private _updatePlayingStatus({ nextState }: { nextState: EngineState }) {
    if (nextState === EngineState.PLAY_REQUESTED) {
      this._hideContent();
    } else if (
      nextState === EngineState.ENDED ||
      (nextState === EngineState.SRC_SET && this._engine.isVideoPaused)
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

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    this.view = null;

    this._eventEmitter = null;
    this._engine = null;
  }
}
