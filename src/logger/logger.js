import VIDEO_EVENTS from '../constants/events/video';


const PLAY_REQUEST_WAITING_TIMEOUT = 2000;

export default class Logger {
  constructor({ engine, eventEmitter, config }) {
    this._config = config;
    this._engine = engine;
    this._eventEmitter = eventEmitter;

    this._bindEvents();
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.STATE_CHANGED, this._processStateChange, this);
  }

  _unbindEvents() {
    this._eventEmitter.off(VIDEO_EVENTS.STATE_CHANGED, this._processStateChange, this);
  }

  _processStateChange({ prevState, nextState }) {
    const { STATES } = this._engine;
    if (nextState === STATES.WAITING) {
      switch (prevState) {
        case STATES.PLAYING:
          this._reportDebugInfo(prevState, nextState);
          break;
        case STATES.PLAY_REQUESTED:
          this._startDelayedReport(prevState, nextState);
          break;
        default: break;
      }
    } else if (nextState === STATES.READY_TO_PLAY) {
      if (prevState === STATES.WAITING) {
        this._stopDelayedReport();
      }
    }
  }

  _startDelayedReport(prevState, nextState) {
    this._stopDelayedReport();
    this._playRequestWaitingTimeout = setTimeout(
      () => this._reportDebugInfo(prevState, nextState),
      PLAY_REQUEST_WAITING_TIMEOUT
    );
  }

  _stopDelayedReport() {
    clearTimeout(this._playRequestWaitingTimeout);
  }

  _reportDebugInfo(prevStatus, nextStatus) {
    if (typeof this._config.callback === 'function') {
      this._config.callback({
        prevStatus,
        nextStatus,
        ...this._engine.getDebugInfo()
      });
    } else {
      console.log( // eslint-disable-line no-console
        `DEBUG INFO FOR TRANSITION FROM ${prevStatus} TO ${nextStatus}`,
        this._engine.getDebugInfo()
      );
    }
  }

  destroy() {
    this._stopDelayedReport();

    this._unbindEvents();

    delete this._eventEmitter;
    delete this._engine;
  }
}
