import { IPlayViewConfig } from './types';

import View from './play.view';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../../constants/index';

export default class PlayControl {
  static moduleName = 'playControl';
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'textMap', 'theme'];

  private _engine;
  private _eventEmitter;
  private _textMap;
  private _theme;

  private _interceptor;
  private _isPlaying: boolean;

  view: View;

  constructor({ engine, eventEmitter, textMap, theme }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._theme = theme;

    this._isPlaying = null;

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();

    this.setControlStatus(false);

    this._initInterceptor();
  }

  get node() {
    return this.view.getNode();
  }

  _initInterceptor() {
    this._interceptor = new KeyboardInterceptor(this.node, {
      [KEYCODES.SPACE_BAR]: e => {
        e.stopPropagation();
        this._eventEmitter.emit(
          UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED,
        );
      },
      [KEYCODES.ENTER]: e => {
        e.stopPropagation();
        this._eventEmitter.emit(
          UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED,
        );
      },
    });
  }

  _destroyInterceptor() {
    this._interceptor.destroy();
  }

  _bindCallbacks() {
    this._togglePlayback = this._togglePlayback.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._updatePlayingStatus,
      this,
    );
  }

  _togglePlayback() {
    if (this._isPlaying) {
      this._pauseVideo();
    } else {
      this._playVideo();
    }
  }

  _playVideo() {
    this._engine.play();

    this._eventEmitter.emit(UI_EVENTS.PLAY_TRIGGERED);
  }

  _pauseVideo() {
    this._engine.pause();

    this._eventEmitter.emit(UI_EVENTS.PAUSE_TRIGGERED);
  }

  _updatePlayingStatus({ nextState }) {
    if (nextState === STATES.SRC_SET) {
      this.reset();
    } else if (nextState === STATES.PLAYING) {
      this.setControlStatus(true);
    } else if (
      nextState === STATES.PAUSED ||
      nextState === STATES.ENDED ||
      nextState === STATES.SEEK_IN_PROGRESS
    ) {
      this.setControlStatus(false);
    }
  }

  _initUI() {
    const config: IPlayViewConfig = {
      callbacks: {
        onButtonClick: this._togglePlayback,
      },
      theme: this._theme,
      textMap: this._textMap,
    };

    this.view = new PlayControl.View(config);
  }

  setControlStatus(isPlaying) {
    this._isPlaying = isPlaying;
    this.view.setState({ isPlaying: this._isPlaying });
  }

  _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._updatePlayingStatus,
      this,
    );
  }

  reset() {
    this.setControlStatus(false);
  }

  destroy() {
    this._destroyInterceptor();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this._textMap;
  }
}
