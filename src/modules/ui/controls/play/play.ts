import { IPlayControl, IPlayViewConfig } from './types';

import View from './play.view';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../../constants';

import { IEventEmitter } from '../../../event-emitter/types';
import { IPlaybackEngine } from '../../../playback-engine/types';
import { IThemeService } from '../../core/theme';

import { ITextMap } from '../../../text-map/types';

export default class PlayControl implements IPlayControl {
  static moduleName = 'playControl';
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'textMap', 'theme'];

  private _engine: IPlaybackEngine;
  private _eventEmitter: IEventEmitter;
  private _textMap: ITextMap;
  private _theme: IThemeService;

  private _interceptor: KeyboardInterceptor;
  private _isPlaying: boolean;

  private _unbindEvents: Function;

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

  private _initInterceptor() {
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

  private _destroyInterceptor() {
    this._interceptor.destroy();
  }

  private _bindCallbacks() {
    this._togglePlayback = this._togglePlayback.bind(this);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [[VIDEO_EVENTS.STATE_CHANGED, this._updatePlayingStatus]],
      this,
    );
  }

  private _togglePlayback() {
    if (this._isPlaying) {
      this._pauseVideo();
    } else {
      this._playVideo();
    }
  }

  private _playVideo() {
    this._engine.play();

    this._eventEmitter.emit(UI_EVENTS.PLAY_TRIGGERED);
  }

  private _pauseVideo() {
    this._engine.pause();

    this._eventEmitter.emit(UI_EVENTS.PAUSE_TRIGGERED);
  }

  private _updatePlayingStatus({ nextState }: { nextState: EngineState }) {
    if (nextState === EngineState.SRC_SET) {
      this.reset();
    } else if (nextState === EngineState.PLAYING) {
      this.setControlStatus(true);
    } else if (
      nextState === EngineState.PAUSED ||
      nextState === EngineState.ENDED ||
      nextState === EngineState.SEEK_IN_PROGRESS
    ) {
      this.setControlStatus(false);
    }
  }

  private _initUI() {
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

  reset() {
    this.setControlStatus(false);
  }

  destroy() {
    this._destroyInterceptor();
    this._unbindEvents();
    this.view.destroy();
    this.view = null;

    this._eventEmitter = null;
    this._engine = null;
    this._textMap = null;
  }
}
