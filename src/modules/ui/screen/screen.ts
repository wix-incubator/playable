import { UI_EVENTS, EngineState } from '../../../constants';

import View from './screen.view';

import playerAPI from '../../../core/player-api-decorator';

import { IEventEmitter } from '../../event-emitter/types';
import { VideoViewMode, IScreenConfig, IScreenViewConfig } from './types';

const PLAYBACK_CHANGE_TIMEOUT = 300;

const DEFAULT_CONFIG: IScreenConfig = {
  disableClickProcessing: false,
  nativeControls: false,
};

export default class Screen {
  static moduleName = 'screen';
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
  private _engine;
  private _fullScreenManager;
  private _interactionIndicator;

  private _delayedToggleVideoPlaybackTimeout;

  private _isClickProcessingDisabled: boolean;
  private _isInFullScreen: boolean;

  private _unbindEvents: Function;

  view: View;
  isHidden: boolean;

  constructor({
    config,
    eventEmitter,
    engine,
    fullScreenManager,
    interactionIndicator,
    rootContainer,
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._fullScreenManager = fullScreenManager;
    this._interactionIndicator = interactionIndicator;

    this._isInFullScreen = false;
    this.isHidden = false;

    this._delayedToggleVideoPlaybackTimeout = null;

    const screenConfig = {
      ...DEFAULT_CONFIG,
      ...config.screen,
    };

    this._isClickProcessingDisabled = screenConfig.disableClickProcessing;

    this._bindCallbacks();
    this._initUI(screenConfig.nativeControls);
    this._bindEvents();

    rootContainer.appendComponentNode(this.node);
  }

  get node() {
    return this.view.getNode();
  }

  private _bindCallbacks() {
    this._processNodeClick = this._processNodeClick.bind(this);
    this._processNodeDblClick = this._processNodeDblClick.bind(this);
    this._toggleVideoPlayback = this._toggleVideoPlayback.bind(this);
  }

  private _initUI(isNativeControls) {
    const config: IScreenViewConfig = {
      nativeControls: isNativeControls,
      callbacks: {
        onWrapperMouseClick: this._processNodeClick,
        onWrapperMouseDblClick: this._processNodeDblClick,
      },
      playbackViewNode: this._engine.getNode(),
    };

    this.view = new View(config);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this._setFullScreenStatus],
        [UI_EVENTS.PLAY_OVERLAY_TRIGGERED, this.view.focusOnNode, this.view],
        [UI_EVENTS.RESIZE, this._updateBackgroundSize],
        [EngineState.SRC_SET, this.view.resetBackground, this.view],
        [EngineState.METADATA_LOADED, this.view.resetAspectRatio, this.view],
      ],
      this,
    );
  }

  private _updateBackgroundSize({ width, height }) {
    this.view.setBackgroundSize(width, height);
  }

  showCursor() {
    this.view.showCursor();
  }

  hideCursor() {
    this.view.hideCursor();
  }

  private _setFullScreenStatus(isInFullScreen) {
    this._isInFullScreen = isInFullScreen;
  }

  private _processNodeClick() {
    if (this._isClickProcessingDisabled) {
      return;
    }

    this._showPlaybackChangeIndicator();

    if (
      !this._fullScreenManager.isEnabled ||
      this._fullScreenManager._enterFullScreenOnPlay
    ) {
      this._toggleVideoPlayback();
    } else {
      this._setDelayedPlaybackToggle();
    }
  }

  private _processNodeDblClick() {
    if (this._isClickProcessingDisabled) {
      return;
    }

    if (
      this._fullScreenManager.isEnabled ||
      !this._fullScreenManager._enterFullScreenOnPlay
    ) {
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

    this._delayedToggleVideoPlaybackTimeout = setTimeout(
      this._toggleVideoPlayback,
      PLAYBACK_CHANGE_TIMEOUT,
    );
  }

  private _clearDelayedPlaybackToggle() {
    clearTimeout(this._delayedToggleVideoPlaybackTimeout);
    this._delayedToggleVideoPlaybackTimeout = null;
  }

  private get _isDelayedPlaybackToggleExist() {
    return Boolean(this._delayedToggleVideoPlaybackTimeout);
  }

  private _toggleVideoPlayback() {
    this._clearDelayedPlaybackToggle();

    const state = this._engine.getCurrentState();

    if (state === EngineState.PLAY_REQUESTED || state === EngineState.PLAYING) {
      this._eventEmitter.emit(UI_EVENTS.PAUSE_WITH_SCREEN_CLICK_TRIGGERED);
      this._engine.pause();
    } else {
      this._eventEmitter.emit(UI_EVENTS.PLAY_WITH_SCREEN_CLICK_TRIGGERED);
      this._engine.play();
    }
  }

  private _toggleFullScreen() {
    if (this._isInFullScreen) {
      this._exitFullScreen();
    } else {
      this._enterFullScreen();
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

  @playerAPI()
  setVideoViewMode(viewMode: VideoViewMode) {
    this.view.setViewMode(viewMode);
  }

  private _enterFullScreen() {
    this._fullScreenManager.enterFullScreen();
  }

  private _exitFullScreen() {
    this._fullScreenManager.exitFullScreen();
  }

  destroy() {
    this._unbindEvents();

    this._clearDelayedPlaybackToggle();
    this.view.destroy();
    delete this.view;

    delete this._interactionIndicator;
    delete this._eventEmitter;
    delete this._engine;
    delete this._fullScreenManager;
  }
}
