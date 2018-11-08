import { IEventEmitter } from '../event-emitter/types';

import { VIDEO_EVENTS } from '../../constants';

export const NATIVE_VIDEO_TO_BROADCAST = [
  'loadstart',
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
  private _eventEmitter: IEventEmitter;
  private _video: HTMLVideoElement;
  private _currentVolume: number;
  private _currentMute: boolean;
  private _shouldCheckVolume: boolean;

  constructor(eventEmitter: IEventEmitter, video: HTMLVideoElement) {
    this._eventEmitter = eventEmitter;
    this._video = video;

    this._currentMute = this._video.muted;
    this._currentVolume = this._video.volume;

    this._bindCallbacks();
    this._bindEvents();
  }

  private _bindCallbacks() {
    this._processEventFromVideo = this._processEventFromVideo.bind(this);
  }

  private _bindEvents() {
    NATIVE_VIDEO_TO_BROADCAST.forEach(event =>
      this._video.addEventListener(event, this._processEventFromVideo),
    );
  }

  private _unbindEvents() {
    NATIVE_VIDEO_TO_BROADCAST.forEach(event =>
      this._video.removeEventListener(event, this._processEventFromVideo),
    );
  }

  private _processEventFromVideo(event: any = {}) {
    const videoEl = this._video;
    switch (event.type) {
      case 'loadstart': {
        if (this._shouldCheckVolume) {
          this._checkVolumeChanges();
        }

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
        if (this._shouldCheckVolume) {
          this._shouldCheckVolume = false;
        }
        this._checkVolumeChanges();
        break;
      }
      default:
        break;
    }
  }

  private _checkVolumeChanges() {
    const videoEl = this._video;

    if (this._currentVolume !== videoEl.volume) {
      this._currentVolume = videoEl.volume * 100;
      this._eventEmitter.emit(VIDEO_EVENTS.VOLUME_CHANGED, this._currentVolume);
    }

    if (this._currentMute !== videoEl.muted) {
      this._currentMute = videoEl.muted;
      this._eventEmitter.emit(VIDEO_EVENTS.MUTE_CHANGED, this._currentMute);
    }

    this._eventEmitter.emit(VIDEO_EVENTS.SOUND_STATE_CHANGED, {
      volume: videoEl.volume,
      muted: videoEl.muted,
    });
  }

  //Workaround for problem with HTML5Video not firing volumechange if source changed right after volume/muted changed
  checkVolumeChangeAfterLoadStart() {
    this._shouldCheckVolume = true;
  }

  destroy() {
    this._unbindEvents();

    this._video = null;
    this._eventEmitter = null;
  }
}
