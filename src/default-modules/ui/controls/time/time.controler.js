import View from './time.view';

import { VIDEO_EVENTS } from '../../../../constants/index';

const UPDATE_INTERVAL_DELAY = 500;

export default class TimeControl {
  static View = View;
  static dependencies = ['engine', 'eventEmitter'];

  constructor({ eventEmitter, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this._bindCallbacks();
    this._initUI();
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
    this._eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this._toggleIntervalUpdates, this);
    this._eventEmitter.on(VIDEO_EVENTS.SEEK_FINISHED, this._updateCurrentTime, this);
    this._eventEmitter.on(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
  }

  _initUI() {
    this.view = new this.constructor.View();
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

  _toggleIntervalUpdates({ nextState }) {
    const { STATES } = this._engine;

    switch (nextState) {
      case STATES.SRC_SET:
        this.reset();
        break;
      case STATES.PLAYING:
        this._startIntervalUpdates();
        break;
      case STATES.SEEK_IN_PROGRESS:
        this._updateCurrentTime();
        break;
      default:
        this._stopIntervalUpdates();
        break;
    }
  }

  _updateDurationTime() {
    this.setDurationTime(this._engine.getDurationTime());
  }

  _updateCurrentTime() {
    this.setCurrentTime(this._engine.getCurrentTime());
  }

  setDurationTime(time) {
    this.view.setState({ duration: time });
  }

  setCurrentTime(time) {
    this.view.setState({ current: time });
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
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._toggleIntervalUpdates, this);
    this._eventEmitter.off(VIDEO_EVENTS.SEEK_FINISHED, this._updateCurrentTime, this);
    this._eventEmitter.off(VIDEO_EVENTS.DURATION_UPDATED, this._updateDurationTime, this);
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
