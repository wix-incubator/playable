import { STATES, VIDEO_EVENTS, LiveState, UI_EVENTS } from '../../constants';
import Engine from './playback-engine';

const SEEK_BY_UI_EVENTS = [
  UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED,
  UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
  UI_EVENTS.PROGRESS_CHANGE_TRIGGERED,
];

class LiveStateEngine {
  static dependencies = ['eventEmitter', 'engine'];

  private _eventEmitter;
  private _engine: Engine;
  private _state: LiveState;

  private _isSeekedByUIWhilePlaying: boolean;

  constructor({ eventEmitter, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._state = LiveState.NONE;

    this._isSeekedByUIWhilePlaying = null;

    this._bindEvents();
  }

  getState(): LiveState {
    return this._state;
  }

  private _bindEvents() {
    this._eventEmitter.on(
      VIDEO_EVENTS.STATE_CHANGED,
      this._processStateChange,
      this,
    );

    SEEK_BY_UI_EVENTS.forEach(event => {
      this._eventEmitter.on(event, this._processSeekByUI, this);
    });

    this._eventEmitter.on(
      VIDEO_EVENTS.DYNAMIC_CONTENT_ENDED,
      this._onDynamicContentEnded,
      this,
    );
  }

  _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.STATE_CHANGED,
      this._processStateChange,
      this,
    );

    SEEK_BY_UI_EVENTS.forEach(event => {
      this._eventEmitter.on(event, this._processSeekByUI, this);
    });
  }

  private _processStateChange({ prevState, nextState }) {
    if (nextState === STATES.SRC_SET) {
      this._setState(LiveState.NONE);
      return;
    }

    if (!this._engine.isDynamicContent) {
      return;
    }

    switch (nextState) {
      case STATES.METADATA_LOADED:
        this._setState(LiveState.INITIAL);
        break;

      case STATES.PLAY_REQUESTED:
        if (this._state === LiveState.INITIAL) {
          this._engine.syncWithLive();
        }
        break;

      case STATES.PLAYING:
        // NOTE: skip PLAYING event after events like `WAITING` and other not important events.
        if (
          this._state === LiveState.INITIAL ||
          this._state === LiveState.NOT_SYNC ||
          this._isSeekedByUIWhilePlaying
        ) {
          this._setState(
            this._engine.isSyncWithLive ? LiveState.SYNC : LiveState.NOT_SYNC,
          );
          this._isSeekedByUIWhilePlaying = false;
        }
        break;

      case STATES.PAUSED:
        // NOTE: process `PAUSED` event only `PLAYING`, to be sure its not related with `WAITING` events
        if (prevState === STATES.PLAYING) {
          this._setState(LiveState.NOT_SYNC);
        }
        break;

      default:
        break;
    }
  }

  private _processSeekByUI() {
    if (this._engine.getCurrentState() === STATES.PLAYING) {
      // NOTE: flag should be handled on `PLAYING` state in `_processStateChange`
      this._isSeekedByUIWhilePlaying = true;
    }
  }

  private _onDynamicContentEnded() {
    this._setState(LiveState.ENDED);
  }

  private _setState(state) {
    if (this._state !== state) {
      const prevState = this._state;
      const nextState = state;

      this._state = state;
      this._eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, { prevState, nextState });
    }
  }

  destroy() {
    this._eventEmitter = null;
    this._engine = null;
    this._state = null;
  }
}

export default LiveStateEngine;
