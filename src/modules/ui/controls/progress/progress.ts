import View from './progress.view';

import {
  getTimePercent,
  getOverallBufferedPercent,
  getOverallPlayedPercent,
} from '../../../../utils/video-data';

import {
  VIDEO_EVENTS,
  UI_EVENTS,
  EngineState,
  LiveState,
} from '../../../../constants';
import { AMOUNT_TO_SKIP_SECONDS } from '../../../keyboard-control/keyboard-control';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';
import playerAPI from '../../../../core/player-api-decorator';

import { IEventEmitter } from '../../../event-emitter/types';
import { ITooltipService } from '../../core/tooltip';
import { IProgressViewConfig } from './types';

const UPDATE_INTERVAL_DELAY = 1000 / 60;

export default class ProgressControl {
  static moduleName = 'progressControl';
  static View = View;
  static dependencies = [
    'engine',
    'liveStateEngine',
    'eventEmitter',
    'textMap',
    'tooltipService',
    'theme',
  ];

  private _engine;
  private _liveStateEngine;
  private _eventEmitter: IEventEmitter;
  private _textMap;
  private _tooltipService: ITooltipService;
  private _theme;

  private _isUserInteracting: boolean;
  private _shouldPlayAfterManipulationEnd: boolean;
  private _currentProgress: number;
  private _interceptor;
  private _updateControlInterval;
  private _timeIndicatorsToAdd: number[];

  private _unbindEvents: Function;

  view: View;
  isHidden: boolean;

  constructor({
    engine,
    liveStateEngine,
    eventEmitter,
    textMap,
    tooltipService,
    theme,
  }) {
    this._engine = engine;
    this._liveStateEngine = liveStateEngine;
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._tooltipService = tooltipService;
    this._isUserInteracting = false;
    this._currentProgress = 0;
    this._theme = theme;

    this._timeIndicatorsToAdd = [];

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();

    this.view.setPlayed(0);
    this.view.setBuffered(0);

    this._initInterceptor();
  }

  get node() {
    return this.view.getNode();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [VIDEO_EVENTS.STATE_CHANGED, this._processStateChange],
        [VIDEO_EVENTS.LIVE_STATE_CHANGED, this._processLiveStateChange],
        [VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator],
        [VIDEO_EVENTS.DURATION_UPDATED, this._updateAllIndicators],
      ],
      this,
    );
  }

  private _initUI() {
    const config: IProgressViewConfig = {
      callbacks: {
        onSyncWithLiveClick: this._syncWithLive,
        onChangePlayedProgress: this._changePlayedProgress,
        onSeekToByMouseStart: this._onSeekToByMouseStart,
        onSeekToByMouseEnd: this._onSeekToByMouseEnd,
        onDragStart: this._onUserInteractionStarts,
        onDragEnd: this._onUserInteractionEnds,
      },
      theme: this._theme,
      textMap: this._textMap,
      tooltipService: this._tooltipService,
    };

    this.view = new ProgressControl.View(config);
  }

  private _initInterceptor() {
    this._interceptor = new KeyboardInterceptor(this.view.getNode(), {
      [KEYCODES.UP_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED);
        this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
      },
      [KEYCODES.DOWN_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED);
        this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
      },
      [KEYCODES.RIGHT_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED);
        this._engine.goForward(AMOUNT_TO_SKIP_SECONDS);
      },
      [KEYCODES.LEFT_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED);
        this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
      },
    });
  }

  private _destroyInterceptor() {
    this._interceptor.destroy();
  }

  private _bindCallbacks() {
    this._syncWithLive = this._syncWithLive.bind(this);
    this._updateControlOnInterval = this._updateControlOnInterval.bind(this);
    this._changePlayedProgress = this._changePlayedProgress.bind(this);
    this._onSeekToByMouseStart = this._onSeekToByMouseStart.bind(this);
    this._onSeekToByMouseEnd = this._onSeekToByMouseEnd.bind(this);
    this._onUserInteractionStarts = this._onUserInteractionStarts.bind(this);
    this._onUserInteractionEnds = this._onUserInteractionEnds.bind(this);
    this._processStateChange = this._processStateChange.bind(this);
    this._playVideoOnProgressManipulationEnd = this._playVideoOnProgressManipulationEnd.bind(
      this,
    );
  }

  private _changePlayedProgress(value) {
    if (this._currentProgress === value) {
      return;
    }

    this._currentProgress = value;
    this._changeCurrentTimeOfVideo(this._currentProgress / 100);
  }

  private _startIntervalUpdates() {
    if (this._updateControlInterval) {
      this._stopIntervalUpdates();
    }

    this._updateControlOnInterval();

    this._updateControlInterval = setInterval(
      this._updateControlOnInterval,
      UPDATE_INTERVAL_DELAY,
    );
  }

  private _onSeekToByMouseStart(percent) {
    const durationTime = this._engine.getDurationTime();
    const seekTime = durationTime * percent / 100;
    const time = this._engine.isDynamicContent
      ? seekTime - durationTime
      : seekTime;

    this.view.showProgressTimeTooltip({ time, percent });
  }

  private _onSeekToByMouseEnd() {
    this.view.hideProgressTimeTooltip();
  }

  private _stopIntervalUpdates() {
    clearInterval(this._updateControlInterval);
    this._updateControlInterval = false;
  }

  private _onUserInteractionStarts() {
    if (!this._isUserInteracting) {
      this._isUserInteracting = true;
      this._pauseVideoOnProgressManipulationStart();
    }

    this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_START);
  }

  private _onUserInteractionEnds() {
    if (this._isUserInteracting) {
      this._isUserInteracting = false;
      this._playVideoOnProgressManipulationEnd();
    }

    this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_END);
  }

  private _updateControlOnInterval() {
    this._updatePlayedIndicator();
    this._updateBufferIndicator();
  }

  private _processStateChange({ nextState }) {
    switch (nextState) {
      case EngineState.SRC_SET:
        this.reset();
        break;
      case EngineState.METADATA_LOADED:
        this._initTimeIndicators();

        if (this._engine.isSeekAvailable) {
          this.show();
        } else {
          this.hide();
        }

        break;
      case EngineState.PLAYING:
        if (this._liveStateEngine.state === LiveState.SYNC) {
          this.view.setPlayed(100);
        } else {
          this._startIntervalUpdates();
        }
        break;
      case EngineState.SEEK_IN_PROGRESS:
        this._updatePlayedIndicator();
        this._updateBufferIndicator();
        break;
      default:
        this._stopIntervalUpdates();
        break;
    }
  }

  private _processLiveStateChange({ nextState }) {
    switch (nextState) {
      case LiveState.NONE:
        this.view.setLiveSyncStatus(false);
        this.view.setUsualMode();
        break;

      case LiveState.INITIAL:
        this.view.setLiveMode();
        break;

      case LiveState.SYNC:
        this.view.setLiveSyncStatus(true);
        break;

      case LiveState.NOT_SYNC:
        this.view.setLiveSyncStatus(false);
        break;

      case LiveState.ENDED:
        this.view.setLiveSyncStatus(false);
        this.view.hideSyncWithLive();

        // ensure progress indicators show latest info
        if (this._engine.getCurrentState() === EngineState.PLAYING) {
          this._startIntervalUpdates();
        } else {
          this._updatePlayedIndicator();
          this._updateBufferIndicator();
        }
        break;

      default:
        break;
    }
  }

  private _changeCurrentTimeOfVideo(percent) {
    const duration = this._engine.getDurationTime();

    this._engine.setCurrentTime(duration * percent);

    this._eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED, percent);
  }

  private _pauseVideoOnProgressManipulationStart() {
    const currentState = this._engine.getCurrentState();

    if (
      currentState === EngineState.PLAYING ||
      currentState === EngineState.PLAY_REQUESTED
    ) {
      this._shouldPlayAfterManipulationEnd = true;
      this._engine.pause();
    }
    this._eventEmitter.emit(UI_EVENTS.PROGRESS_MANIPULATION_STARTED);
  }

  private _playVideoOnProgressManipulationEnd() {
    if (this._shouldPlayAfterManipulationEnd) {
      this._engine.play();

      this._shouldPlayAfterManipulationEnd = false;
    }

    this._eventEmitter.emit(UI_EVENTS.PROGRESS_MANIPULATION_ENDED);
  }

  private _updateBufferIndicator() {
    const currentTime = this._engine.getCurrentTime();
    const buffered = this._engine.getBuffered();
    const duration = this._engine.getDurationTime();

    this.updateBuffered(
      getOverallBufferedPercent(buffered, currentTime, duration),
    );
  }

  private _updatePlayedIndicator() {
    if (this._liveStateEngine.state === LiveState.SYNC) {
      // TODO: mb use this.updatePlayed(100) here?
      return;
    }

    const currentTime = this._engine.getCurrentTime();
    const duration = this._engine.getDurationTime();

    this.updatePlayed(getOverallPlayedPercent(currentTime, duration));
  }

  private _updateAllIndicators() {
    this._updatePlayedIndicator();
    this._updateBufferIndicator();
  }

  private _initTimeIndicators() {
    this._timeIndicatorsToAdd.forEach(time => {
      this._addTimeIndicator(time);
    });
    this._timeIndicatorsToAdd = [];
  }

  private _addTimeIndicator(time) {
    const durationTime = this._engine.getDurationTime();

    if (time > durationTime) {
      // TODO: log error for developers
      return;
    }

    this.view.addTimeIndicator(getTimePercent(time, durationTime));
  }

  private _syncWithLive() {
    this._engine.syncWithLive();
  }

  /**
   * Add time indicator to progress bar
   */
  @playerAPI()
  addTimeIndicator(time: number) {
    this.addTimeIndicators([time]);
  }

  /**
   * Add time indicators to progress bar
   */
  @playerAPI()
  addTimeIndicators(times: number[]) {
    if (!this._engine.isMetadataLoaded) {
      // NOTE: Add indicator after metadata loaded
      this._timeIndicatorsToAdd.push(...times);
      return;
    }

    times.forEach(time => {
      this._addTimeIndicator(time);
    });
  }

  /**
   * Delete all time indicators from progress bar
   */
  @playerAPI()
  clearTimeIndicators() {
    this.view.clearTimeIndicators();
  }

  updatePlayed(percent) {
    this._currentProgress = percent;
    this.view.setPlayed(this._currentProgress);
  }

  updateBuffered(percent) {
    this.view.setBuffered(percent);
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
    this.updatePlayed(0);
    this.updateBuffered(0);
    this.clearTimeIndicators();
  }

  destroy() {
    this._destroyInterceptor();
    this._stopIntervalUpdates();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this._liveStateEngine;
    delete this._timeIndicatorsToAdd;
  }
}
