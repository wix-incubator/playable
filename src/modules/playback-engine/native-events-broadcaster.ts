import { IEventEmitter } from '../event-emitter/types';

import { VideoEvent } from '../../constants';
import { IVideoOutput } from './types';

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
  private _output: IVideoOutput;
  private _currentVolume: number;
  private _currentMute: boolean;
  private _shouldCheckVolume: boolean;

  constructor(eventEmitter: IEventEmitter, output: IVideoOutput) {
    this._eventEmitter = eventEmitter;
    this._output = output;

    this._currentMute = this._output.isMuted;
    this._currentVolume = this._output.volume;

    this._bindCallbacks();
    this._bindEvents();
  }

  private _bindCallbacks() {
    this._processEventFromVideo = this._processEventFromVideo.bind(this);
  }

  private _bindEvents() {
    NATIVE_VIDEO_TO_BROADCAST.forEach(event =>
      this._output.on(event, this._processEventFromVideo),
    );
  }

  private _unbindEvents() {
    NATIVE_VIDEO_TO_BROADCAST.forEach(event =>
      this._output.off(event, this._processEventFromVideo),
    );
  }

  private _processEventFromVideo(event: any = {}) {
    const output = this._output;
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
          output.currentTime,
        );
        break;
      }
      case 'durationchange': {
        this._eventEmitter.emitAsync(
          VideoEvent.DURATION_UPDATED,
          output.duration,
        );
        break;
      }
      case 'timeupdate': {
        this._eventEmitter.emitAsync(
          VideoEvent.CURRENT_TIME_UPDATED,
          output.currentTime,
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
    const output = this._output;

    if (this._currentVolume !== output.volume) {
      this._currentVolume = output.volume * 100;
      this._eventEmitter.emitAsync(
        VideoEvent.VOLUME_CHANGED,
        this._currentVolume,
      );
    }

    if (this._currentMute !== output.isMuted) {
      this._currentMute = output.isMuted;
      this._eventEmitter.emitAsync(VideoEvent.MUTE_CHANGED, this._currentMute);
    }

    this._eventEmitter.emitAsync(VideoEvent.SOUND_STATE_CHANGED, {
      volume: output.volume,
      muted: output.isMuted,
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
