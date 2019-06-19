import { VideoEvent, UIEvent, EngineState } from '../../../constants';

import playerAPI from '../../../core/player-api-decorator';

import View from './overlay.view';
import { IOverlayAPI, IOverlay, IOverlayViewConfig } from './types';
import { IEventEmitter } from '../../event-emitter/types';
import { IPlaybackEngine } from '../../playback-engine/types';
import { IThemeService } from '../core/theme';
import { IRootContainer } from '../../root-container/types';
import { IPlayerConfig } from '../../../core/config';
import { IMainUIBlock } from '../main-ui-block/types';
import { ILoader } from '../loader/types';

class Overlay implements IOverlay {
  static moduleName = 'overlay';
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'rootContainer',
    'theme',
    'config',
    'mainUIBlock',
    'loader',
  ];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _theme: IThemeService;
  private _loader: ILoader;

  private _unbindEvents: () => void;

  private _mainUIBlock: IMainUIBlock;
  view: View;
  isHidden: boolean = false;

  constructor({
    eventEmitter,
    engine,
    rootContainer,
    theme,
    config,
    mainUIBlock,
    loader,
  }: {
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    rootContainer: IRootContainer;
    theme: IThemeService;
    config: IPlayerConfig;
    mainUIBlock: IMainUIBlock;
    loader: ILoader;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._theme = theme;
    this._mainUIBlock = mainUIBlock;
    this._loader = loader;

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
        [VideoEvent.STATE_CHANGED, this._updatePlayingState],
        [VideoEvent.RESET, this._tryShowContent],
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

    this._eventEmitter.emitAsync(UIEvent.PLAY_OVERLAY_CLICK);
  }

  private _tryShowContent() {
    if (this._engine.isPaused) {
      this._showContent();
    }
  }

  private _hideContent() {
    this.view.hideContent();
    this._loader.show();
    this._mainUIBlock.enableShowingContent();
  }

  private _showContent() {
    this.view.showContent();
    this._loader.hide();
    this._mainUIBlock.disableShowingContent();
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

  /**
   * After initialisation player has by default an overlay that is black;
   *
   * The `.turnOnOverlayTransparency()` method makes this overlay transparent.
   * @example
   * player.turnOnOverlayTransparency();
   *
   */
  @playerAPI()
  turnOnOverlayTransparency() {
    this.view.turnOnOverlayTransparency();
  }

  /**
   * The `.turnOffOverlayTransparency()` method returns player's overlay to default settings.
   * It becomes black again.
   *
   * @example
   * player.turnOffOverlayTransparency();
   *
   */
  @playerAPI()
  turnOffOverlayTransparency() {
    this.view.turnOffOverlayTransparency();
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
  }
}

export { IOverlayAPI };
export default Overlay;
