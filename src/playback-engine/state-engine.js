import { VIDEO_EVENTS } from '../constants';


export const STATES = {
  SRC_SET: 'src-set',
  LOAD_STARTED: 'load-started',
  METADATA_LOADED: 'metadata-loaded',
  READY_TO_PLAY: 'ready-to-play',
  SEEK_IN_PROGRESS: 'seek-in-progress',
  PLAY_REQUESTED: 'play-requested',
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended'
};

const NATIVE_VIDEO_EVENTS_TO_STATE = [
  'loadstart', 'loadedmetadata', 'canplay', 'play', 'playing', 'pause', 'ended', 'waiting', 'seeking', 'seeked'
];

export default class Engine {
  static dependencies = ['eventEmitter', 'config'];

  constructor(eventEmitter, video) {
    this._eventEmitter = eventEmitter;
    this._video = video;

    this._currentState = null;

    this._isMetadataLoaded = false;
    this._statesTimestamps = {};

    this._bindCallbacks();
    this._bindEvents();
  }

  _bindCallbacks() {
    this._processEventFromVideo = this._processEventFromVideo.bind(this);
  }

  _bindEvents() {
    NATIVE_VIDEO_EVENTS_TO_STATE.forEach(event => this._video.addEventListener(event, this._processEventFromVideo));
  }

  _unbindEvents() {
    NATIVE_VIDEO_EVENTS_TO_STATE.forEach(event => this._video.removeEventListener(event, this._processEventFromVideo));
  }

  clearTimestamps() {
    this._statesTimestamps = {};
  }

  _setInitialTimeStamp() {
    this._initialTimeStamp = Date.now();
  }

  _setStateTimestamp(state) {
    if (!this._statesTimestamps[state]) {
      this._statesTimestamps[state] = Date.now() - this._initialTimeStamp;
      this._setInitialTimeStamp();
    }
  }

  getStateTimestamps() {
    return this._statesTimestamps;
  }

  _processEventFromVideo(event) {
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
        this.setState(STATES.PLAYING);
        break;
      }
      case 'waiting': {
        this.setState(STATES.WAITING);
        break;
      }
      case 'pause': {
        this.setState(STATES.PAUSED);
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
    //This case is happens only with dash.js sometimes when manifest got some problems
    if (this._currentState === STATES.METADATA_LOADED) {
      if (state === STATES.SEEK_IN_PROGRESS || state === STATES.PAUSED) {
        return;
      }
    }

    this._eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, { prevState: this._currentState, nextState: state });
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
