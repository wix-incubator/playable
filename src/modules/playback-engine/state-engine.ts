import { IEventEmitter } from '../event-emitter/types';

import { isSafari } from '../../utils/device-detection';

import { VideoEvent, EngineState } from '../../constants';
import { IVideoOutput } from './types';

export const NATIVE_VIDEO_EVENTS_TO_STATE = [
  'loadstart',
  'loadedmetadata',
  'canplay',
  'play',
  'playing',
  'pause',
  'ended',
  'waiting',
  'seeking',
  'seeked',
];

export default class StateEngine {
  private _eventEmitter: IEventEmitter;
  private _output: IVideoOutput;
  private _currentState: EngineState;
  private _statesTimestamps: { [state: string]: number };
  private _initialTimeStamp: number;
  private _isMetadataLoaded: boolean;

  constructor(eventEmitter: IEventEmitter, video: IVideoOutput) {
    this._eventEmitter = eventEmitter;
    this._output = video;

    this._currentState = null;

    this._isMetadataLoaded = false;
    this._statesTimestamps = {};

    this._bindCallbacks();
    this._bindEvents();
  }

  private _bindCallbacks() {
    this._processEventFromVideo = this._processEventFromVideo.bind(this);
  }

  private _bindEvents() {
    NATIVE_VIDEO_EVENTS_TO_STATE.forEach(event => {
      this._output.on(event, this._processEventFromVideo);
    });
  }

  private _unbindEvents() {
    NATIVE_VIDEO_EVENTS_TO_STATE.forEach(event =>
      this._output.off(event, this._processEventFromVideo),
    );
  }

  clearTimestamps() {
    this._statesTimestamps = {};
  }

  private _setInitialTimeStamp() {
    this._initialTimeStamp = Date.now();
  }

  private _setStateTimestamp(state: EngineState) {
    if (!this._statesTimestamps[state]) {
      this._statesTimestamps[state] = Date.now() - this._initialTimeStamp;
      this._setInitialTimeStamp();
    }
  }

  get stateTimestamps() {
    return this._statesTimestamps;
  }

  private _processEventFromVideo(event: any = {}) {
    const output = this._output;

    switch (event.type) {
      case 'loadstart': {
        this._setInitialTimeStamp();
        this.setState(EngineState.LOAD_STARTED);
        break;
      }
      case 'loadedmetadata': {
        this._setStateTimestamp(EngineState.METADATA_LOADED);
        this.setState(EngineState.METADATA_LOADED);
        this._isMetadataLoaded = true;
        break;
      }
      case 'canplay': {
        if (this._currentState === EngineState.METADATA_LOADED) {
          this._setStateTimestamp(EngineState.READY_TO_PLAY);
          this.setState(EngineState.READY_TO_PLAY);
        }
        break;
      }
      case 'play': {
        this.setState(EngineState.PLAY_REQUESTED);
        break;
      }
      case 'playing': {
        // Safari triggers event 'playing' even when play request aborted by browser. So we need to check if video is actualy playing
        if (isSafari()) {
          if (!output.isPaused) {
            this.setState(EngineState.PLAYING);
          }
        } else {
          this.setState(EngineState.PLAYING);
        }
        break;
      }
      case 'waiting': {
        this.setState(EngineState.WAITING);
        break;
      }
      case 'pause': {
        // Safari triggers event 'pause' even when playing was aborted buy autoplay policies, emit pause event even if there wasn't any real playback
        if (isSafari()) {
          if (output.length) {
            this.setState(EngineState.PAUSED);
          }
        } else {
          this.setState(EngineState.PAUSED);
        }
        break;
      }
      case 'ended': {
        this.setState(EngineState.ENDED);
        break;
      }
      case 'seeking': {
        this.setState(EngineState.SEEK_IN_PROGRESS);
        break;
      }
      case 'seeked': {
        this.setState(
          output.isPaused ? EngineState.PAUSED : EngineState.PLAYING,
        );
        break;
      }
      default:
        break;
    }
  }

  setState(state: EngineState) {
    if (state === this._currentState) {
      return;
    }

    //This case is happens only with dash.js sometimes when manifest got some problems
    if (this._currentState === EngineState.METADATA_LOADED) {
      if (
        state === EngineState.SEEK_IN_PROGRESS ||
        state === EngineState.PAUSED
      ) {
        return;
      }
    }

    this._eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
      prevState: this._currentState,
      nextState: state,
    });
    this._eventEmitter.emitAsync(state);
    this._currentState = state;
  }

  get isMetadataLoaded() {
    return this._isMetadataLoaded;
  }

  get state() {
    return this._currentState;
  }

  destroy() {
    this._unbindEvents();
  }
}
