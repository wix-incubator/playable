import View from './progress.view';

import { getOverallBufferedPercent, getOverallPlayedPercent } from '../../../utils/video-data';

import VIDEO_EVENTS from '../../../constants/events/video';
import UI_EVENTS from '../../../constants/events/ui';


const UPDATE_INTERVAL_DELAY = 1000 / 60;

export default class ProgressControl {
  static View = View;

  constructor({ engine, eventEmitter }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;

    this._isUserInteracting = false;
    this._currentProgress = 0;

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._toggleIntervalUpdates, this);
    this._eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updatePlayedIndicator, this);
    this._eventEmitter.on(VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator, this);
    this._eventEmitter.on(VIDEO_EVENTS.SEEK_ENDED, this._updateBufferIndicator, this);
  }

  _initUI() {
    const config = {
      callbacks: {
        onChangePlayedProgress: this._changePlayedProgress,
        onUserInteractionStart: this._toggleUserInteractingStatus,
        onUserInteractionEnd: this._toggleUserInteractingStatus
      }
    };

    this.view = new this.constructor.View(config);
  }

  _bindCallbacks() {
    this._updateControlOnInterval = this._updateControlOnInterval.bind(this);
    this._changePlayedProgress = this._changePlayedProgress.bind(this);
    this._toggleUserInteractingStatus = this._toggleUserInteractingStatus.bind(this);
    this._toggleIntervalUpdates = this._toggleIntervalUpdates.bind(this);
  }

  _changePlayedProgress(value) {
    if (this._currentProgress === value) {
      return;
    }

    this._currentProgress = value;
    this._changeCurrentTimeOfVideo(this._currentProgress / 100);
  }

  _startIntervalUpdates() {
    if (this._updateControlInterval) {
      this._stopIntervalUpdates();
    }

    this._updateControlInterval = setInterval(this._updateControlOnInterval, UPDATE_INTERVAL_DELAY);
  }

  _stopIntervalUpdates() {
    clearInterval(this._updateControlInterval);
    this._updateControlInterval = null;
  }

  _toggleUserInteractingStatus() {
    this._isUserInteracting = !this._isUserInteracting;
    if (this._isUserInteracting) {
      this._pauseVideoOnProgressManipulationStart();
    } else {
      this._playVideoOnProgressManipulationEnd();
    }
  }

  _updateControlOnInterval() {
    this._updatePlayedIndicator();
    this._updateBufferIndicator();
  }

  _toggleIntervalUpdates(status) {
    if (status === this._engine.STATUSES.SRC_SET) {
      this.reset();
    } else if (status === this._engine.STATUSES.PLAYING) {
      this._startIntervalUpdates();
    } else {
      this._stopIntervalUpdates();
    }
  }

  _changeCurrentTimeOfVideo(percent) {
    const duration = this._engine.getDurationTime();

    if (duration) {
      this._engine.setCurrentTime(duration * percent);
    }

    this._eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED, percent);
  }

  _pauseVideoOnProgressManipulationStart() {
    this._previousPlaybackStatus = this._engine.getPlaybackState().status;
    this._engine.pause();

    this._eventEmitter.emit(UI_EVENTS.PROGRESS_MANIPULATION_STARTED);
  }

  _playVideoOnProgressManipulationEnd() {
    if (this._previousPlaybackStatus === this._engine.STATUSES.PLAYING ||
      this._previousPlaybackStatus === this._engine.STATUSES.PLAY_REQUESTED) {
      this._engine.play();
    }

    this._previousPlaybackStatus = null;
    this._eventEmitter.emit(UI_EVENTS.PROGRESS_MANIPULATION_ENDED);
  }

  _updateBufferIndicator() {
    const currentTime = this._engine.getCurrentTime();
    const buffered = this._engine.getBuffered();
    const duration = this._engine.getDurationTime();

    this.updateBuffered(getOverallBufferedPercent(buffered, currentTime, duration));
  }

  _updatePlayedIndicator() {
    const currentTime = this._engine.getCurrentTime();
    const duration = this._engine.getDurationTime();

    this.updatePlayed(getOverallPlayedPercent(currentTime, duration));
  }

  updatePlayed(percent) {
    if (!this._isUserInteracting) {
      this._currentProgress = percent;
      this.view.updatePlayed(this._currentProgress);
    }
  }

  updateBuffered(percent) {
    this.view.updateBuffered(percent);
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._toggleIntervalUpdates, this);
    this._eventEmitter.off(VIDEO_EVENTS.SEEK_STARTED, this._updatePlayedIndicator, this);
    this._eventEmitter.off(VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator, this);
    this._eventEmitter.off(VIDEO_EVENTS.SEEK_ENDED, this._updateBufferIndicator, this);
  }

  reset() {
    this.updatePlayed(0);
    this.updateBuffered(0);
  }

  destroy() {
    this._stopIntervalUpdates();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;

    this._isUserInteracting = null;
    this._currentProgress = null;
    this.isHidden = null;
  }
}
