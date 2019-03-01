import { IEventEmitter } from '../../../event-emitter/types';
import { VideoEvent } from '../../../../constants';

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

  constructor(eventEmitter: IEventEmitter, output: HTMLVideoElement) {
    this._eventEmitter = eventEmitter;
    this._video = output;

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
    const video = this._video;
    switch (event.type) {
      case 'loadstart': {
        if (this._shouldCheckVolume) {
          this._checkVolumeChanges();
        }

        break;
      }
      case 'progress': {
        this._eventEmitter.emitAsync(VideoEvent.CHUNK_LOADED);
        break;
      }
      case 'stalled': {
        this._eventEmitter.emitAsync(VideoEvent.UPLOAD_STALLED);
        break;
      }
      case 'suspend': {
        this._eventEmitter.emitAsync(VideoEvent.UPLOAD_SUSPEND);
        break;
      }
      case 'seeking': {
        this._eventEmitter.emitAsync(
          VideoEvent.SEEK_IN_PROGRESS,
          video.currentTime,
        );
        break;
      }
      case 'durationchange': {
        this._eventEmitter.emitAsync(
          VideoEvent.DURATION_UPDATED,
          video.duration,
        );
        break;
      }
      case 'timeupdate': {
        this._eventEmitter.emitAsync(
          VideoEvent.CURRENT_TIME_UPDATED,
          video.currentTime,
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
    const video = this._video;

    if (this._currentVolume !== video.volume) {
      this._currentVolume = video.volume * 100;
      this._eventEmitter.emitAsync(
        VideoEvent.VOLUME_CHANGED,
        this._currentVolume,
      );
    }

    if (this._currentMute !== video.muted) {
      this._currentMute = video.muted;
      this._eventEmitter.emitAsync(VideoEvent.MUTE_CHANGED, this._currentMute);
    }

    this._eventEmitter.emitAsync(VideoEvent.SOUND_STATE_CHANGED, {
      volume: video.volume,
      muted: video.muted,
    });
  }

  //Workaround for problem with HTML5Video not firing volumechange if source changed right after volume/muted changed
  checkVolumeChangeAfterLoadStart() {
    this._shouldCheckVolume = true;
  }

  destroy() {
    this._unbindEvents();
  }
}
