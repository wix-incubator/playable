import { VIDEO_EVENTS, STATES } from '../../constants';

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
  private _eventEmitter;
  private _video;
  private _currentState;
  private _statesTimestamps;
  private _initialTimeStamp;
  private _isMetadataLoaded: boolean;

  constructor(eventEmitter, video) {
    this._eventEmitter = eventEmitter;
    this._video = video;

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
    NATIVE_VIDEO_EVENTS_TO_STATE.forEach(event =>
      this._video.addEventListener(event, this._processEventFromVideo),
    );
  }

  private _unbindEvents() {
    NATIVE_VIDEO_EVENTS_TO_STATE.forEach(event =>
      this._video.removeEventListener(event, this._processEventFromVideo),
    );
  }

  clearTimestamps() {
    this._statesTimestamps = {};
  }

  private _setInitialTimeStamp() {
    this._initialTimeStamp = Date.now();
  }

  private _setStateTimestamp(state) {
    if (!this._statesTimestamps[state]) {
      this._statesTimestamps[state] = Date.now() - this._initialTimeStamp;
      this._setInitialTimeStamp();
    }
  }

  getStateTimestamps() {
    return this._statesTimestamps;
  }

  private _processEventFromVideo(event: any = {}) {
    const videoEl = this._video;

    switch (event.type) {
      case 'loadstart': {
        this._setInitialTimeStamp();
        this.setState(STATES.LOAD_STARTED);
        break;
      }
      case 'loadedmetadata': {
        this._setStateTimestamp(STATES.METADATA_LOADED);
        this.setState(STATES.METADATA_LOADED);
        this._isMetadataLoaded = true;
        break;
      }
      case 'canplay': {
        this._setStateTimestamp(STATES.READY_TO_PLAY);
        this.setState(STATES.READY_TO_PLAY);
        break;
      }
      case 'play': {
        this.setState(STATES.PLAY_REQUESTED);
        break;
      }
      case 'playing': {
        // Event 'playing' also triggers even when play request aborted by browser. So we need to check if video is actualy playing
        if (!videoEl.paused) {
          this.setState(STATES.PLAYING);
        }
        break;
      }
      case 'waiting': {
        this.setState(STATES.WAITING);
        break;
      }
      case 'pause': {
        // No need to set state PAUSED since there was no actual playing of any parts of video
        if (videoEl.played.length) {
          this.setState(STATES.PAUSED);
        }
        break;
      }
      case 'ended': {
        this.setState(STATES.ENDED);
        break;
      }
      case 'seeking': {
        this.setState(STATES.SEEK_IN_PROGRESS);
        break;
      }
      case 'seeked': {
        this.setState(videoEl.paused ? STATES.PAUSED : STATES.PLAYING);
        break;
      }
      default:
        break;
    }
  }

  setState(state) {
    if (state === this._currentState) {
      return;
    }

    //This case is happens only with dash.js sometimes when manifest got some problems
    if (this._currentState === STATES.METADATA_LOADED) {
      if (state === STATES.SEEK_IN_PROGRESS || state === STATES.PAUSED) {
        return;
      }
    }

    this._eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
      prevState: this._currentState,
      nextState: state,
    });
    this._currentState = state;
  }

  get isMetadataLoaded() {
    return this._isMetadataLoaded;
  }

  getState() {
    return this._currentState;
  }

  destroy() {
    this._unbindEvents();

    delete this._eventEmitter;
    delete this._video;
  }
}
