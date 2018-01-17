import { IProgressViewOptions } from './types';
import View from './progress.view';

import {
  getTimePercent,
  getOverallBufferedPercent,
  getOverallPlayedPercent,
} from '../../../../utils/video-data';

import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../../constants/index';
import { AMOUNT_TO_SKIP_SECONDS } from '../../../keyboard-control/keyboard-control';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';
import playerAPI from '../../../../utils/player-api-decorator';
import { ITooltipService } from '../../core/tooltip';

const UPDATE_INTERVAL_DELAY = 1000 / 60;

export default class ProgressControl {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'textMap', 'tooltipService'];

  private _engine;
  private _eventEmitter;
  private _textMap;
  private _tooltipService: ITooltipService;

  private _isUserInteracting: boolean;
  private _shouldPlayAfterManipulationEnd: boolean;
  private _currentProgress: number;
  private _interceptor;
  private _updateControlInterval;
  private _timeIndicatorsToAdd: number[];

  view: View;
  isHidden: boolean;

  constructor({ engine, eventEmitter, textMap, tooltipService }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._tooltipService = tooltipService;
    this._isUserInteracting = false;
    this._currentProgress = 0;

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
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._processStateChange,
      this,
    );
    this._eventEmitter.on(
      VIDEO_EVENTS.CHUNK_LOADED,
      this._updateBufferIndicator,
      this,
    );
    this._eventEmitter.on(
      VIDEO_EVENTS.DURATION_UPDATED,
      this._updateAllIndicators,
      this,
    );
  }

  private _initUI() {
    const config: IProgressViewOptions = {
      callbacks: {
        onSyncWithLiveClick: this._syncWithLive,
        onChangePlayedProgress: this._changePlayedProgress,
        onDragStart: this._onUserInteractionStarts,
        onDragEnd: this._onUserInteractionEnds,
      },
      textMap: this._textMap,
      tooltipService: this._tooltipService,
    };

    this.view = new ProgressControl.View(config);
  }

  private _initInterceptor() {
    this._interceptor = new KeyboardInterceptor({
      node: this.view.getNode(),
      callbacks: {
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
          this._eventEmitter.emit(
            UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
          );
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
          this._eventEmitter.emit(
            UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
          );
          this._engine.goBackward(AMOUNT_TO_SKIP_SECONDS);
        },
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

    this._updateControlInterval = setInterval(
      this._updateControlOnInterval,
      UPDATE_INTERVAL_DELAY,
    );
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
      case STATES.SRC_SET:
        this.reset();
        break;
      case STATES.METADATA_LOADED:
        this._initTimeIndicators();

        if (this._engine.isSeekAvailable) {
          this.show();
          if (this._engine.isDynamicContent) {
            this.view.setLiveMode();
          } else {
            this.view.setUsualMode();
          }
        } else {
          this.hide();
        }

        break;
      case STATES.PLAYING:
        if (this._engine.isSyncWithLive) {
          this.view.setPlayed(100);
        } else {
          this._startIntervalUpdates();
        }
        break;
      case STATES.SEEK_IN_PROGRESS:
        this._updatePlayedIndicator();
        this._updateBufferIndicator();
        break;
      default:
        this._stopIntervalUpdates();
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
      currentState === STATES.PLAYING ||
      currentState === STATES.PLAY_REQUESTED
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
    if (this._engine.isSyncWithLive) {
      this.view.setLiveSyncStatus(true);
      return;
    }

    this.view.setLiveSyncStatus(false);

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

  private _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.DURATION_UPDATED,
      this._updateAllIndicators,
      this,
    );
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._processStateChange,
      this,
    );
    this._eventEmitter.off(
      VIDEO_EVENTS.CHUNK_LOADED,
      this._updateBufferIndicator,
      this,
    );
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
    delete this._timeIndicatorsToAdd;
  }
}
