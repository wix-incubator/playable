import Vidi from 'vidi';
import $ from 'jbone';

import VIDEO_EVENTS from '../constants/events/video';


export default class Engine {
  constructor({ eventEmitter }) {
    this._eventEmitter = eventEmitter;
    this._$video = $('<video/>');
    this._vidi = new Vidi(this._$video[0]);

    this._initEventsProxy();
  }

  getNode() {
    return this._$video[0];
  }

  _initEventsProxy() {
    const videoEl = this._vidi.getVideoElement();

    this._vidi.on('statuschange', status => {
      this._eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, status);
    });

    this._$video.on('canplay', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.CAN_PLAY);
    });

    this._$video.on('loadedmetadata', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.METADATA_LOADED);
    });

    this._$video.on('progress', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
    });

    this._vidi.on('loadstart', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.LOAD_STARTED);
    });

    this._vidi.on('loadeddata', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.LOADED_FIRST_CHUNK);
    });

    this._vidi.on('durationchange', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED, videoEl.duration);
    });

    this._vidi.on('timeupdate', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.CURRENT_TIME_UPDATED, videoEl.currentTime);
    });

    this._$video.on('seeking', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED, videoEl.currentTime);
    });

    this._$video.on('seeked', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED, videoEl.currentTime);
    });

    this._$video.on('volumechange', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, {
        volume: videoEl.volume,
        muted: videoEl.muted
      });
    });
  }

  getPlaybackState() {
    return this._vidi.getPlaybackState();
  }

  setSrc(src) {
    this._vidi.src = src;
  }

  setAutoplay(isAutoplay) {
    this._$video[0].autoplay = Boolean(isAutoplay);
  }

  getAutoplay() {
    return this._$video[0].autoplay;
  }

  setLoop(isLoop) {
    this._$video[0].loop = Boolean(isLoop);
  }

  getLoop() {
    return this._$video[0].loop;
  }

  setMute(isMuted) {
    this._$video[0].muted = Boolean(isMuted);
  }

  getMute() {
    return this._$video[0].muted;
  }

  setVolume(volume) {
    const parsedVolume = Number(volume);
    this._$video[0].volume = isNaN(parsedVolume) ? 1 : Math.max(0, Math.min(Number(volume), 1));
  }

  getVolume() {
    return this._$video[0].volume;
  }

  setPreload(preload) {
    this._$video[0].preload = preload || 'auto';
  }

  getPreload() {
    return this._$video[0].preload;
  }

  getReadyState() {
    return this._$video[0].readyState;
  }

  getCurrentTime() {
    return this._$video[0].currentTime;
  }

  setCurrentTime(time) {
    this._$video[0].currentTime = time;
  }

  getDurationTime() {
    return this._$video[0].duration;
  }

  getBuffered() {
    return this._$video[0].buffered;
  }

  destroy() {
    delete this._eventEmitter;
    delete this._$video;

    this._vidi.setVideoElement();
    delete this._vidi;
  }

  play() {
    this._vidi.play();
  }

  pause() {
    this._vidi.pause();
  }
}
