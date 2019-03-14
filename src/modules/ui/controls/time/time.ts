import View from './time.view';

import {
  VideoEvent,
  EngineState,
  LiveState,
  UIEvent,
} from '../../../../constants';

import { IEventEmitter } from '../../../event-emitter/types';
import { IPlaybackEngine } from '../../../playback-engine/types';
import { ITimeControl, ITimeViewConfig } from './types';
import { IThemeService } from '../../core/theme';

const UPDATE_INTERVAL_DELAY = 1000 / 60;

export default class TimeControl implements ITimeControl {
  static moduleName = 'timeControl';
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'theme'];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _theme: IThemeService;

  private _updateControlInterval: number;
  private _unbindEvents: () => void;

  view: View;
  isHidden: boolean;

  constructor({
    eventEmitter,
    engine,
    theme,
  }: {
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    theme: IThemeService;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._theme = theme;

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();

    this._setCurrentTime(0);
    this._setDurationTime(0);
  }

  getElement() {
    return this.view.getElement();
  }

  private _bindCallbacks() {
    this._updateCurrentTime = this._updateCurrentTime.bind(this);
    this._updateDurationTime = this._updateDurationTime.bind(this);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [UIEvent.PROGRESS_USER_PREVIEWING_FRAME, this._updateTimeFromPreview],
        [VideoEvent.STATE_CHANGED, this._toggleIntervalUpdates],
        [VideoEvent.DURATION_UPDATED, this._updateDurationTime],
        [VideoEvent.LIVE_STATE_CHANGED, this._processLiveStateChange],
      ],
      this,
    );
  }

  private _initUI() {
    const config: ITimeViewConfig = {
      theme: this._theme,
    };
    this.view = new TimeControl.View(config);
  }

  private _startIntervalUpdates() {
    if (this._updateControlInterval) {
      this._stopIntervalUpdates();
    }

    this._updateCurrentTime();

    this._updateControlInterval = window.setInterval(
      this._updateCurrentTime,
      UPDATE_INTERVAL_DELAY,
    );
  }

  private _stopIntervalUpdates() {
    window.clearInterval(this._updateControlInterval);
    this._updateControlInterval = null;
  }

  private _processLiveStateChange({ nextState }: { nextState: LiveState }) {
    switch (nextState) {
      case LiveState.NONE:
        this.show();
        break;

      case LiveState.INITIAL:
        this.hide();
        break;

      case LiveState.ENDED:
        this.show();
        break;

      default:
        break;
    }
  }

  private _toggleIntervalUpdates({ nextState }: { nextState: EngineState }) {
    switch (nextState) {
      case EngineState.SRC_SET:
        this.reset();
        break;
      case EngineState.PLAYING:
        this._startIntervalUpdates();
        break;
      case EngineState.SEEK_IN_PROGRESS:
        this._startIntervalUpdates();
        break;
      default:
        this._stopIntervalUpdates();
        break;
    }
  }

  private _updateDurationTime() {
    this._setDurationTime(this._engine.getDuration());
  }

  private _updateCurrentTime() {
    const time = this._engine.getCurrentTime();
    this._setCurrentTime(time);
  }

  private _updateTimeFromPreview(time: number) {
    this.view.setCurrentTime(time);
  }

  private _setDurationTime(time: number) {
    this.view.setDurationTime(time);
  }

  private _setCurrentTime(time: number) {
    this.view.setCurrentTime(time);
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  reset() {
    this._setDurationTime(0);
    this._setCurrentTime(0);
    this.view.showDuration();
    this.view.setCurrentTimeBackward(false);
    this.show();
  }

  destroy() {
    this._stopIntervalUpdates();
    this._unbindEvents();
    this.view.destroy();
  }
}
