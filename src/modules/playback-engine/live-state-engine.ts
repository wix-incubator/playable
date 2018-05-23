import {
  EngineState,
  VIDEO_EVENTS,
  LiveState,
  UI_EVENTS,
} from '../../constants';

import { IEventEmitter, IEventMap } from '../event-emitter/types';
import { IPlaybackEngine } from '../playback-engine/types';

const SEEK_BY_UI_EVENTS = [
  UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED,
  UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
  UI_EVENTS.PROGRESS_CHANGE_TRIGGERED,
];

class LiveStateEngine {
  static moduleName = 'liveStateEngine';
  static dependencies = ['eventEmitter', 'engine'];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;
  private _state: LiveState;

  private _isSeekedByUIWhilePlaying: boolean;

  private _unbindEvents: Function;

  constructor({ eventEmitter, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._state = LiveState.NONE;

    this._isSeekedByUIWhilePlaying = null;

    this._bindEvents();
  }

  get state(): LiveState {
    return this._state;
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [VIDEO_EVENTS.STATE_CHANGED, this._processStateChange],
        ...SEEK_BY_UI_EVENTS.map(
          eventName => [eventName, this._processSeekByUI] as IEventMap,
        ),
        [VIDEO_EVENTS.DYNAMIC_CONTENT_ENDED, this._onDynamicContentEnded],
      ],
      this,
    );
  }

  private _processStateChange({ prevState, nextState }) {
    if (nextState === EngineState.SRC_SET) {
      this._setState(LiveState.NONE);
      return;
    }

    if (!this._engine.isDynamicContent || this._engine.isDynamicContentEnded) {
      return;
    }

    switch (nextState) {
      case EngineState.METADATA_LOADED:
        this._setState(LiveState.INITIAL);
        break;

      case EngineState.PLAY_REQUESTED:
        if (this._state === LiveState.INITIAL) {
          this._engine.syncWithLive();
        }
        break;

      case EngineState.PLAYING:
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

      case EngineState.PAUSED:
        // NOTE: process `PAUSED` event only `PLAYING`, to be sure its not related with `WAITING` events
        if (prevState === EngineState.PLAYING) {
          this._setState(LiveState.NOT_SYNC);
        }
        break;

      default:
        break;
    }
  }

  private _processSeekByUI() {
    if (
      this._engine.isDynamicContent &&
      this._engine.getCurrentState() === EngineState.PLAYING
    ) {
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
      this._eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
        prevState,
        nextState,
      });
    }
  }

  destroy() {
    this._unbindEvents();
    this._eventEmitter = null;
    this._engine = null;
    this._state = null;
  }
}

export default LiveStateEngine;
