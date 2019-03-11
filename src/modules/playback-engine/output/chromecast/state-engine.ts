import { IEventEmitter } from '../../../event-emitter/types';

import { VideoEvent, EngineState } from '../../../../constants';
import RemotePlayerController = cast.framework.RemotePlayerController;
import { IVideoOutput } from '../../types';

export default class StateEngine {
  private _eventEmitter: IEventEmitter;
  private _currentState: EngineState;
  private _isMetadataLoaded: boolean;
  private _remotePlayerController: RemotePlayerController;
  private _currentVolume: number;
  private _currentMute: boolean;
  private _output: IVideoOutput;

  constructor(
    eventEmitter: IEventEmitter,
    output: IVideoOutput,
    controller: RemotePlayerController,
  ) {
    this._eventEmitter = eventEmitter;
    this._remotePlayerController = controller;
    this._output = output;

    this._currentState = null;

    this._isMetadataLoaded = false;

    this._bindCallbacks();
    this._bindEvents();
  }

  private _bindCallbacks() {
    this._processEventFromVideo = this._processEventFromVideo.bind(this);
  }

  private _bindEvents() {
    const castEvents = cast.framework.RemotePlayerEventType;

    this._remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.ANY_CHANGE,
      e => {
        this._processEventFromVideo(e);
      },
    );

    this._remotePlayerController.addEventListener(
      castEvents.IS_PAUSED_CHANGED,
      e => {
        const isPaused = e.value;
        this.setState(isPaused ? EngineState.PAUSED : EngineState.PLAYING);

        this._processEventFromVideo(e);
      },
    );
  }

  private _processEventFromVideo(event: any = {}) {
    switch (event.field) {
      case 'playerState': {
        if (event.value === 'PLAYING') {
          this.setState(EngineState.PLAYING);
          return;
        }

        if (event.value === 'PAUSED') {
          this.setState(EngineState.PAUSED);
          return;
        }

        if (event.value === null) {
          this.setState(EngineState.ENDED);
          return;
        }

        break;
      }
      case 'volumeLevel':
      case 'isMuted':
        this._checkVolumeChanges();
        break;
      case 'mediaInfo':
        if (event.value && event.value.duration) {
          this._eventEmitter.emitAsync(
            VideoEvent.DURATION_UPDATED,
            event.value,
          );
        }
        break;
      default:
        break;
    }
  }

  private _checkVolumeChanges() {
    const output = this._output;
    const newVolume = Math.floor(output.volume * 100);

    if (this._currentVolume !== newVolume) {
      this._currentVolume = newVolume;
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
      volume: this._currentVolume,
      muted: this._currentMute,
    });
  }

  setState(state: EngineState) {
    if (state === this._currentState) {
      return;
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
    this._eventEmitter = null;
  }
}
