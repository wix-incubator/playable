import { VIDEO_EVENTS } from '../../constants/index';

export const NATIVE_VIDEO_TO_BROADCAST = [
  'progress',
  'error',
  'stalled',
  'suspend',
  'durationchange',
  'timeupdate',
  'volumechange',
  'seeking',
];

export default class NativeEventsBroadcaster {
  private _eventEmitter;
  private _video;
  private _currentVolume: number;
  private _currentMute: boolean;

  constructor(eventEmitter, video) {
    this._eventEmitter = eventEmitter;
    this._video = video;

    this._currentMute = this._video.muted;
    this._currentVolume = this._video.volume;

    this._bindCallbacks();
    this._bindEvents();
  }

  _bindCallbacks() {
    this._processEventFromVideo = this._processEventFromVideo.bind(this);
  }

  _bindEvents() {
    NATIVE_VIDEO_TO_BROADCAST.forEach(event =>
      this._video.addEventListener(event, this._processEventFromVideo),
    );
  }

  _unbindEvents() {
    NATIVE_VIDEO_TO_BROADCAST.forEach(event =>
      this._video.removeEventListener(event, this._processEventFromVideo),
    );
  }

  _processEventFromVideo(event: any = {}) {
    const videoEl = this._video;

    switch (event.type) {
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
      case 'seeking': {
        this._eventEmitter.emit(
          VIDEO_EVENTS.SEEK_IN_PROGRESS,
          videoEl.currentTime,
        );
        break;
      }
      case 'durationchange': {
        this._eventEmitter.emit(
          VIDEO_EVENTS.DURATION_UPDATED,
          videoEl.duration,
        );
        break;
      }
      case 'timeupdate': {
        this._eventEmitter.emit(
          VIDEO_EVENTS.CURRENT_TIME_UPDATED,
          videoEl.currentTime,
        );
        break;
      }
      case 'volumechange': {
        if (this._currentVolume !== videoEl.volume) {
          this._currentVolume = videoEl.volume * 100;
          this._eventEmitter.emit(
            VIDEO_EVENTS.VOLUME_CHANGED,
            this._currentVolume,
          );
        }

        if (this._currentMute !== videoEl.muted) {
          this._currentMute = videoEl.muted;
          this._eventEmitter.emit(VIDEO_EVENTS.MUTE_CHANGED, this._currentMute);
        }

        this._eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, {
          volume: videoEl.volume,
          muted: videoEl.muted,
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
