import { VIDEO_EVENTS } from '../constants';


const NATIVE_VIDEO_TO_BROADCAST = [
  'progress', 'error', 'stalled', 'suspend', 'durationchange', 'timeupdate', 'volumechange'
];

export default class NativeEventsBroadcast {
  constructor(eventEmitter, video) {
    this._eventEmitter = eventEmitter;
    this._video = video;

    this._bindCallbacks();
    this._bindEvents();
  }

  _bindCallbacks() {
    this._processEventFromVideo = this._processEventFromVideo.bind(this);
  }

  _bindEvents() {
    NATIVE_VIDEO_TO_BROADCAST.forEach(event => this._video.addEventListener(event, this._processEventFromVideo));
  }

  _unbindEvents() {
    NATIVE_VIDEO_TO_BROADCAST.forEach(event => this._video.removeEventListener(event, this._processEventFromVideo));
  }

  _processEventFromVideo(event) {
    const videoEl = this._video;

    switch (event.type) {
      case 'error': {
        this._eventEmitter.emit(VIDEO_EVENTS.ERROR, videoEl.error);
        break;
      }
      case 'progress': {
        this._eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
        break;
      }
      case 'stalled': {
        this._eventEmitter.emit(VIDEO_EVENTS.UPLOAD_STALLED);
        break;
      }
      case 'suspend': {
        this._eventEmitter.emit(VIDEO_EVENTS.UPLOAD_SUSPEND);
        break;
      }
      case 'durationchange': {
        this._eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED, videoEl.duration);
        break;
      }
      case 'timeupdate': {
        this._eventEmitter.emit(VIDEO_EVENTS.CURRENT_TIME_UPDATED, videoEl.currentTime);
        break;
      }
      case 'volumechange': {
        this._eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, {
          volume: videoEl.volume,
          muted: videoEl.muted
        });
        break;
      }
      default:
        break;
    }
  }

  destroy() {
    this._unbindEvents();

    delete this._video;
    delete this._eventEmitter;
  }
}
