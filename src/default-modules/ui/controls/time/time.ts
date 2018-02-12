import { ITimeViewConfig } from './types';

import View from './time.view';

import { VIDEO_EVENTS, STATES } from '../../../../constants/index';

const UPDATE_INTERVAL_DELAY = 1000 / 60;

export default class TimeControl {
  static moduleName = 'timeControl';
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'theme'];

  private _eventEmitter;
  private _engine;
  private _theme;

  private _updateControlInterval;

  view: View;
  isHidden: boolean;

  constructor({ eventEmitter, engine, theme }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._theme = theme;

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
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._toggleIntervalUpdates,
      this,
    );
    this._eventEmitter.on(
      VIDEO_EVENTS.DURATION_UPDATED,
      this._updateDurationTime,
      this,
    );
  }

  _initUI() {
    const config: ITimeViewConfig = {
      theme: this._theme,
    };
    this.view = new TimeControl.View(config);
  }

  _startIntervalUpdates() {
    if (this._updateControlInterval) {
      this._stopIntervalUpdates();
    }
    this._updateControlInterval = setInterval(
      this._updateCurrentTime,
      UPDATE_INTERVAL_DELAY,
    );
  }

  _stopIntervalUpdates() {
    clearInterval(this._updateControlInterval);
    this._updateControlInterval = null;
  }

  _toggleIntervalUpdates({ nextState }) {
    switch (nextState) {
      case STATES.SRC_SET:
        this.reset();
        break;
      case STATES.METADATA_LOADED:
        if (this._engine.isSeekAvailable) {
          if (this._engine.isDynamicContent) {
            // TODO: is duration hidden when live ended?
            this.view.hideDuration();
          }
        } else {
          this.hide();
        }
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
    if (this._engine.isDynamicContent) {
      // TODO: is it same for live ended?
      this.view.setCurrentTimeBackward(!this._engine.isSyncWithLive);
    }

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
    this.view.showDuration();
    this.view.setCurrentTimeBackward(false);
    this.show();
  }

  _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._toggleIntervalUpdates,
      this,
    );
    this._eventEmitter.off(
      VIDEO_EVENTS.DURATION_UPDATED,
      this._updateDurationTime,
      this,
    );
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
