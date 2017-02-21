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
    overlay
  }) {

    this.eventEmitter = new EventEmitter();

    this.$video = $('<video/>');

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

    this.vidi = new Vidi(this.$video[0]);

    this._createUI(size, controls, overlay);

    this.vidi.src = src;
    this._initEventsProxy();
  }

  _createUI(size, controls, overlay) {
    const config = {};

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
      vidi: this.vidi,
      eventEmitter: this.eventEmitter,
      config
    });
  }

  get node() {
    if (!this.ui) {
      return;
    }

    return this.ui.node[0];
  }

  _initEventsProxy() {
    this.vidi.on('statuschange', status => {
      this.eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, status);
    });

    this.$video.on('loadedmetadata', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.METADATA_LOADED);
    });

    this.$video.on('progress', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
    });

    this.vidi.on('loadstart', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.LOAD_STARTED);
    });

    this.vidi.on('durationchange', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED);
    });

    this.vidi.on('timeupdate', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.CURRENT_TIME_UPDATED);
    });

    this.$video.on('seeking', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED);
    });

    this.$video.on('seeked', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED);
    });

    this.$video.on('volumechange', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED);
    });
  }

  setAutoplay(isAutoplay) {
    this.$video[0].autoplay = Boolean(isAutoplay);
  }

  setLoop(isLoop) {
    this.$video[0].loop = Boolean(isLoop);
  }

  setMute(isMuted) {
    this.$video[0].muted = Boolean(isMuted);
  }

  setVolume(volume) {
    const parsedVolume = Number(volume);
    this.$video[0].volume = isNaN(parsedVolume) ? 1 : Math.max(0, Math.min(Number(volume), 1));
  }

  setPreload(preload) {
    this.$video[0].preload = preload || 'auto';
  }

  on(name, callback) {
    this.eventEmitter.on(name, callback);
  }

  off(name, callback) {
    this.eventEmitter.off(name, callback);
  }

  destroy() {
    this.ui.destroy();
    delete this.ui;

    delete this.eventEmitter;
    delete this.$video;

    this.vidi.setVideoElement();
    delete this.vidi;
  }
}

export default Player;
