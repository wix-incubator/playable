import { UIEvent, EngineState } from '../../../constants';

import View from './focus-screen.view';

import { IEventEmitter } from '../../event-emitter/types';
import { IFullScreenManager } from '../../full-screen-manager/types';
import { IPlaybackEngine } from '../../playback-engine/types';
import { IInteractionIndicator } from '../interaction-indicator/types';
import { IPlayerConfig } from '../../../core/config';
import { IRootContainer } from '../../root-container/types';
import { IFocusScreen, IFocusScreenViewConfig } from './types';

const PLAYBACK_CHANGE_TIMEOUT = 300;

class FocusScreen implements IFocusScreen {
  static moduleName = 'focusScreen';
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'config',
    'fullScreenManager',
    'interactionIndicator',
    'rootContainer',
  ];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _fullScreenManager: IFullScreenManager;
  private _interactionIndicator: IInteractionIndicator;

  private _delayedToggleVideoPlaybackTimeout: number;

  private _isClickProcessingDisabled: boolean;

  private _unbindEvents: () => void;

  view: View;
  isHidden: boolean;

  constructor({
    config,
    eventEmitter,
    engine,
    fullScreenManager,
    interactionIndicator,
    rootContainer,
  }: {
    config: IPlayerConfig;
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    fullScreenManager: IFullScreenManager;
    interactionIndicator: IInteractionIndicator;
    rootContainer: IRootContainer;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._fullScreenManager = fullScreenManager;
    this._interactionIndicator = interactionIndicator;

    this.isHidden = false;

    this._delayedToggleVideoPlaybackTimeout = null;

    this._isClickProcessingDisabled = Boolean(
      config.disableControlWithClickOnPlayer,
    );

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();

    rootContainer.appendComponentElement(this.getElement());
  }

  getElement() {
    return this.view.getElement();
  }

  private _bindCallbacks() {
    this._processClick = this._processClick.bind(this);
    this._processDblClick = this._processDblClick.bind(this);
    this._toggleVideoPlayback = this._toggleVideoPlayback.bind(this);
  }

  private _initUI() {
    const config: IFocusScreenViewConfig = {
      callbacks: {
        onWrapperMouseClick: this._processClick,
        onWrapperMouseDblClick: this._processDblClick,
      },
    };

    this.view = new View(config);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [[UIEvent.PLAY_OVERLAY_CLICK, this.view.focusOnNode, this.view]],
      this,
    );
  }

  showCursor() {
    this.view.showCursor();
  }

  hideCursor() {
    this.view.hideCursor();
  }

  private _processClick() {
    if (this._isClickProcessingDisabled) {
      return;
    }

    this._showPlaybackChangeIndicator();

    if (!this._fullScreenManager.isEnabled) {
      this._toggleVideoPlayback();
    } else {
      this._setDelayedPlaybackToggle();
    }
  }

  private _processDblClick() {
    if (this._isClickProcessingDisabled) {
      return;
    }

    if (this._fullScreenManager.isEnabled) {
      if (this._isDelayedPlaybackToggleExist) {
        this._clearDelayedPlaybackToggle();
        this._hideDelayedPlaybackChangeIndicator();
      }

      this._toggleFullScreen();
    }
  }

  private _showPlaybackChangeIndicator() {
    const state = this._engine.getCurrentState();

    if (state === EngineState.PLAY_REQUESTED || state === EngineState.PLAYING) {
      this._interactionIndicator.showPause();
    } else {
      this._interactionIndicator.showPlay();
    }
  }

  private _hideDelayedPlaybackChangeIndicator() {
    this._interactionIndicator.hideIcons();
  }

  private _setDelayedPlaybackToggle() {
    this._clearDelayedPlaybackToggle();

    this._delayedToggleVideoPlaybackTimeout = window.setTimeout(
      this._toggleVideoPlayback,
      PLAYBACK_CHANGE_TIMEOUT,
    );
  }

  private _clearDelayedPlaybackToggle() {
    window.clearTimeout(this._delayedToggleVideoPlaybackTimeout);
    this._delayedToggleVideoPlaybackTimeout = null;
  }

  private get _isDelayedPlaybackToggleExist() {
    return Boolean(this._delayedToggleVideoPlaybackTimeout);
  }

  private _toggleVideoPlayback() {
    this._clearDelayedPlaybackToggle();

    const state = this._engine.getCurrentState();

    if (state === EngineState.PLAY_REQUESTED || state === EngineState.PLAYING) {
      this._engine.pause();
      this._eventEmitter.emitAsync(UIEvent.PAUSE_WITH_SCREEN_CLICK);
    } else {
      this._engine.play();
      this._eventEmitter.emitAsync(UIEvent.PLAY_WITH_SCREEN_CLICK);
    }
  }

  private _toggleFullScreen() {
    if (this._fullScreenManager.isInFullScreen) {
      this._fullScreenManager.exitFullScreen();
      this._eventEmitter.emitAsync(UIEvent.EXIT_FULL_SCREEN_WITH_SCREEN_CLICK);
    } else {
      this._fullScreenManager.enterFullScreen();
      this._eventEmitter.emitAsync(UIEvent.ENTER_FULL_SCREEN_WITH_SCREEN_CLICK);
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

  focus() {
    this.view.focusOnNode();
  }

  destroy() {
    this._unbindEvents();

    this._clearDelayedPlaybackToggle();
    this.view.destroy();
  }
}

export default FocusScreen;
