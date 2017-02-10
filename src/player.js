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
      width,
      height,
      preload,
      poster
    });

    if (autoplay) {
      this.$video[0].autoplay = true;
    }

    if (loop) {
      this.$video[0].loop = true;
    }

    if (muted) {
      this.$video[0].muted = true;
    }

    if (volume) {
      const parsedVolume = Number(volume);
      this.$video[0].volume = isNaN(parsedVolume) ? 1 : Math.max(0, Math.min(Number(volume), 1));
    }

    this.vidi = new Vidi(this.$video[0]);
    this.videoStatus = null;

    this.ui = new PlayerUI({
      vidi: this.vidi,
      eventEmitter: this.eventEmitter,
      ...params
    });

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

  setAutoplay(flag) {
    this.$video[0].autoplay = flag;
  }

  setLoop(flag) {
    this.$video[0].loop = flag;
  }

  setMute(flag) {
    this.$video[0].muted = flag;
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
}

export default Player;
