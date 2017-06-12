import Vidi from 'vidi';
import $ from 'jbone';

import VIDEO_EVENTS from '../constants/events/video';


const STATUSES = {
  SRC_SET: 'src-set',
  LOAD_STARTED: 'load-started',
  METADATA_LOADED: 'metadata-loaded',
  READY_TO_PLAY: 'ready-to-play',
  PLAY_REQUESTED: 'play-requested',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended'
};

export default class Engine {
  constructor({ eventEmitter }) {
    this._eventEmitter = eventEmitter;
    this._$video = $('<video/>');
    this._vidi = new Vidi(this._$video[0]);

    this._initEventsProxy();

    this._currentStatus = null;
    this.STATUSES = STATUSES;
  }

  getNode() {
    return this._$video[0];
  }

  _initEventsProxy() {
    const videoEl = this._vidi.getVideoElement();

    this._vidi.on('error', error => {
      this._eventEmitter.emit(VIDEO_EVENTS.ERROR, error);
    });

    this._$video[0].addEventListener('loadstart', () => {
      this._setStatus(STATUSES.LOAD_STARTED);
    });

    this._$video[0].addEventListener('loadedmetadata', () => {
      this._setStatus(STATUSES.METADATA_LOADED);
    });

    this._$video[0].addEventListener('canplay', () => {
      this._setStatus(STATUSES.READY_TO_PLAY);
    });

    this._$video[0].addEventListener('progress', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
    });

    this._$video[0].addEventListener('play', () => {
      this._setStatus(STATUSES.PLAY_REQUESTED);
    });

    this._$video[0].addEventListener('playing', () => {
      this._setStatus(STATUSES.PLAYING);
    });

    this._$video[0].addEventListener('pause', () => {
      this._setStatus(STATUSES.PAUSED);
    });

    this._$video[0].addEventListener('ended', () => {
      this._setStatus(STATUSES.ENDED);
    });

    this._$video[0].addEventListener('stalled', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.UPLOAD_STALLED);
    });

    this._$video[0].addEventListener('suspend', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.UPLOAD_SUSPEND);
    });

    this._$video[0].addEventListener('durationchange', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED, videoEl.duration);
    });

    this._$video[0].addEventListener('timeupdate', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.CURRENT_TIME_UPDATED, videoEl.currentTime);
    });

    this._$video[0].addEventListener('seeking', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED, videoEl.currentTime);
    });

    this._$video[0].addEventListener('seeked', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED, videoEl.currentTime);
    });

    this._$video[0].addEventListener('volumechange', () => {
      this._eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, {
        volume: videoEl.volume,
        muted: videoEl.muted
      });
    });
  }

  _setStatus(status) {
    this._currentStatus = status;
    this._eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, this._currentStatus);
  }

  getPlaybackState() {
    return {
      currentTime: this.getCurrentTime(),
      duration: this.getDurationTime(),
      muted: this.getMute(),
      playbackRate: this.getPlaybackRate(),
      status: this._currentStatus,
      volume: this.getVolume()
    };
  }

  setSrc(src) {
    if (this._vidi.src !== src) {
      this._vidi.src = src;
      this._setStatus(STATUSES.SRC_SET);
    }
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

  setPlaybackRate(rate) {
    this._$video[0].playbackRate = rate;
  }

  getPlaybackRate() {
    return this._$video[0].playbackRate;
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
    return this._$video[0].duration || 0;
  }

  getBuffered() {
    return this._$video[0].buffered;
  }

  setPlayInline(isPlayInline) {
    return this._$video.attr('playsInline', isPlayInline);
  }

  getPlayInline() {
    return this._$video.attr('playsInline');
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
