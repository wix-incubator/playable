import Vidi from 'vidi';
import $ from 'jbone';
import EventEmitter from 'eventemitter3';

import VIDEO_EVENTS from './constants/events/video';

import PlayerUI from './ui/ui.controler';

class Player {
  constructor({
    width,
    height,
    preload,
    poster,
    autoplay,
    loop,
    muted,
    volume,
    src,
    ...params
  }) {

    this.eventEmitter = new EventEmitter();

    this.$video = $('<video/>', {
      preload,
      poster
    });

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
    this.videoStatus = null;

    this.ui = new PlayerUI({
      vidi: this.vidi,
      eventEmitter: this.eventEmitter,
      ...params
    });

    this.setWidth(width);
    this.setHeight(height);

    this.vidi.src = src;
    this.initEventsProxy();
  }

  get node() {
    return this.ui.node[0];
  }

  // This one should be removed after all events would be inside vidi.js
  initEventsProxy() {
    const player = this;
    const $video = player.$video;

    this.vidi.on('statuschange', status => {
      if (player.videoStatus !== status) {
        player.videoStatus = status;
        this.eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, player.videoStatus);
      }
    });

    $video.on('loadedmetadata', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.METADATA_LOADED);
    });

    $video.on('progress', () => {
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

    $video.on('seeking', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED);
    });

    $video.on('seeked', () => {
      this.eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED);
    });

    $video.on('volumechange', () => {
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

  setWidth(rawWidth) {
    const width = Number(rawWidth);

    this.ui.setWidth(width);
  }

  setHeight(rawHeight) {
    const height = Number(rawHeight);

    this.ui.setHeight(height);
  }

  hideControls() {
    this.ui.hideControls();
  }

  showControls() {
    this.ui.showControls();
  }

  hideOverlay() {
    this.ui.hideOverlay();
  }

  showOverlay() {
    this.ui.showOverlay();
  }

  setOverlayBackgroundSrc(src) {
    this.ui.setOverlayBackgroundSrc(src);
  }
}

export default Player;
