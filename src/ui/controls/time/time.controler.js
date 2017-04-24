import View from './time.view';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../../constants/events/video';


const UPDATE_INTERVAL_DELAY = 100;

export default class TimeControl {
  static View = View;

  constructor({ eventEmitter, engine, view }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this._bindCallbacks();
    this._initUI(view);
    this._bindEvents();

    this.setCurrentTime(0);
    this.setDurationTime(0);
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._updateCurrentTime = this._updateCurrentTime.bind(this);
    this._updateDurationTime = this._updateDurationTime.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._toggleIntervalUpdates, this);
    this._eventEmitter.on(VIDEO_EVENTS.LOAD_STARTED, this._updateCurrentTime, this);
    this._eventEmitter.on(VIDEO_EVENTS.SEEK_STARTED, this._updateCurrentTime, this);
    this._eventEmitter.on(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
    this._eventEmitter.on(VIDEO_EVENTS.CHANGE_SRC_TRIGGERED, this.reset, this);
  }

  _initUI(view) {
    if (view) {
      this.view = new view();
    } else {
      this.view = new TimeControl.View();
    }
  }

  _startIntervalUpdates() {
    if (this._updateControlInterval) {
      this._stopIntervalUpdates();
    }
    this._updateControlInterval = setInterval(this._updateCurrentTime, UPDATE_INTERVAL_DELAY);
  }

  _stopIntervalUpdates() {
    clearInterval(this._updateControlInterval);
    this._updateControlInterval = null;
  }

  _toggleIntervalUpdates(status) {
    if (status === VIDI_PLAYBACK_STATUSES.PLAYING || status === VIDI_PLAYBACK_STATUSES.PLAYING_BUFFERING) {
      this._startIntervalUpdates();
    } else {
      this._stopIntervalUpdates();
    }
  }

  _updateDurationTime() {
    this.setDurationTime(this._engine.getDurationTime());
  }

  _updateCurrentTime() {
    this.setCurrentTime(this._engine.getCurrentTime());
  }

  setDurationTime(time) {
    this.view.setDurationTime(time);
  }

  setCurrentTime(time) {
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
    this.setDurationTime(0);
    this.setCurrentTime(0);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._updatePlayingStatus, this);
    this._eventEmitter.off(VIDEO_EVENTS.LOAD_STARTED, this._updateCurrentTime, this);
    this._eventEmitter.off(VIDEO_EVENTS.SEEK_STARTED, this._updateCurrentTime, this);
    this._eventEmitter.off(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
    this._eventEmitter.off(VIDEO_EVENTS.CHANGE_SRC_TRIGGERED, this.reset, this);
  }

  destroy() {
    this._stopIntervalUpdates();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;

    this.isHidden = null;
  }
}
