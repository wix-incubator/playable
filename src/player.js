import Vidi from 'vidi';
import $ from 'jbone';
import EventEmitter from 'eventemitter3';

import VIDEO_EVENTS from './constants/events/video';

import PlayerUI from './ui/ui.controler';

class Player {
  constructor({
    preload,
    autoplay,
    loop,
    muted,
    volume,
    src,
    size,
    controls,
    overlay,
    customUI = []
  }) {

    this._eventEmitter = new EventEmitter();

    this._$video = $('<video/>');

    this.setPreload(preload);

    if (autoplay) {
      this.setAutoplay(true);
    }

    if (loop) {
      this.setLoop(true);
    }

    if (muted) {
       this.setMute(true);
    }

    if (volume) {
      this.setVolume(volume);
    }

    this._vidi = new Vidi(this._$video[0]);

    this._createUI(size, controls, overlay, customUI);

    this._vidi.src = src;
    this._initEventsProxy();
  }

  _createUI(size, controls, overlay, customUI) {
    const config = {
      customUI
    };

    if (size) {
      config.size = size;
    }

    if (controls) {
      config.controls = controls;
    }

    if (overlay) {
      config.overlay = overlay;
    }

    this.ui = new PlayerUI({
      vidi: this._vidi,
      eventEmitter: this._eventEmitter,
      config
    });
  }

  get node() {
    if (!this.ui) {
      return;
    }

    return this.ui.node;
  }

  _initEventsProxy() {
    const videoEl = this._vidi.getVideoElement();

    this._vidi.on('statuschange', status => {
      this._eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, status);
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

  on(name, callback) {
    this._eventEmitter.on(name, callback);
  }

  off(name, callback) {
    this._eventEmitter.off(name, callback);
  }

  _unbindAllEvents() {
    const eventsName = this._eventEmitter.eventNames();

    eventsName.forEach(eventName => {
      this._eventEmitter.removeAllListeners(eventName);
    });
  }

  destroy() {
    this.ui.destroy();
    delete this.ui;

    this._unbindAllEvents();
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

export default Player;
