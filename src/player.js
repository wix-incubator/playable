import Vidi from 'vidi';
import $ from 'jbone';

import VIDEO_EVENTS from './constants/events/video';

import eventEmitter from './event-emitter';
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
    nativeControls,
    src,
    ...params
  }) {
    this.$video = $('<video/>', {
      width,
      height,
      preload,
      poster
    });

    if (autoplay) {
      this.$video.attr('autoplay', true);
    }

    if (loop) {
      this.$video.attr('loop', true);
    }

    if (nativeControls) {
      this.$video.attr('controls', true);
    }

    if (muted) {
      this.$video.attr('muted', true);
    }

    if (volume) {
      const parsedVolume = Number(volume);
      this.$video[0].volume = isNaN(parsedVolume) ? 1 : Math.max(0, Math.min(Number(volume), 1));
    }

    this.vidi = new Vidi(this.$video[0]);
    this.videoStatus = null;

    this.ui = new PlayerUI({
      vidi: this.vidi,
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
        eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, player.videoStatus);
      }
    });

    $video.on('loadedmetadata', () => {
      eventEmitter.emit(VIDEO_EVENTS.METADATA_LOADED);
    });

    $video.on('progress', () => {
      eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
    });

    this.vidi.on('loadstart', () => {
      eventEmitter.emit(VIDEO_EVENTS.LOAD_STARTED);
    });

    this.vidi.on('durationchange', () => {
      eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED);
    });

    this.vidi.on('timeupdate', () => {
      eventEmitter.emit(VIDEO_EVENTS.CURRENT_TIME_UPDATED);
    });

    $video.on('seeking', () => {
      eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED);
    });

    $video.on('seeked', () => {
      eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED);
    });

    $video.on('volumechange', () => {
      eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED);
    });
  }
}

export default Player;
