import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';

import playerAPI from '../../../core/player-api-decorator';

import View from './overlay.view';
import { IOverlay, IOverlayViewConfig } from './types';
import { IEventEmitter } from '../../event-emitter/types';
import { IPlaybackEngine } from '../../playback-engine/types';
import { IThemeService } from '../core/theme';
import { IRootContainer } from '../../root-container/types';
import { IPlayerConfig } from '../../../core/config';

export default class Overlay implements IOverlay {
  static moduleName = 'overlay';
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'rootContainer',
    'theme',
    'config',
  ];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _theme: IThemeService;

  private _unbindEvents: Function;

  view: View;
  isHidden: boolean = false;

  constructor({
    eventEmitter,
    engine,
    rootContainer,
    theme,
    config,
  }: {
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    rootContainer: IRootContainer;
    theme: IThemeService;
    config: IPlayerConfig;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._theme = theme;

    this._bindEvents();
    this._initUI();

    this.setPoster(config.poster);
    if (config.hideOverlay) {
      this.hide();
    }

    rootContainer.appendComponentElement(this.getElement());
  }

  getElement() {
    return this.view.getElement();
  }

  private _initUI() {
    const viewConfig: IOverlayViewConfig = {
      callbacks: {
        onPlayClick: this._playVideo.bind(this),
      },
      theme: this._theme,
    };

    this.view = new Overlay.View(viewConfig);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingState],
        [VIDEO_EVENTS.RESET, this._tryShowContent],
      ],
      this,
    );
  }

  private _updatePlayingState({ nextState }: { nextState: EngineState }) {
    if (nextState === EngineState.PLAY_REQUESTED) {
      this._hideContent();
    } else if (
      nextState === EngineState.ENDED ||
      nextState === EngineState.SRC_SET
    ) {
      this._tryShowContent();
    }
  }

  private _playVideo() {
    this._engine.play();

    this._eventEmitter.emit(UI_EVENTS.PLAY_OVERLAY_CLICK);
  }

  private _tryShowContent() {
    if (this._engine.isPaused) {
      this._showContent();
    }
  }

  private _hideContent() {
    this.view.hideContent();
  }

  private _showContent() {
    this.view.showContent();
  }

  /**
   * Method for completely hiding player overlay. It's not gonna appear on initial state of player and when video is ended.
   * @example
   * player.showOverlay();
   */
  @playerAPI('hideOverlay')
  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  /**
   * Method for showing player overlay after it was completely hidden with `player.hideOverlay()`.
   * @example
   * player.showOverlay();
   */
  @playerAPI('showOverlay')
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
