import Vidi from 'vidi';
import $ from 'jbone';

import VIDEO_EVENTS from './constants/events/video';

import eventEmitter from './event-emitter';
import PlayerUI from './ui/ui';
import initLogger from './logger';


function Player({ src, ui, enableLogger, ...params }) {
  this.$video = $('<video/>', params);

  this.vidi = new Vidi(this.$video[0]);

  if (ui) {
    this.ui = ui({
      $video: this.$video,
      eventEmitter
    });
  } else {
    this.ui = new PlayerUI({
      $video: this.$video,
      vidi: this.vidi
    });
  }

  this.vidi.src = src;

  this.initEventsProxy();

  if (enableLogger) {
    initLogger(this.$video[0]);
  }
}

Player.prototype = {

  /**
   * Getter for DOM node with player
   * @return {Node}
   */
  get node() {
    return this.ui.$wrapper[0];
  },

  /**
   * Creating proxy for <video> events through general eventEmitter
   */
  initEventsProxy() {
    const $video = this.$video;

    $video.on('loadedmetadata', function () {
      eventEmitter.emit(VIDEO_EVENTS.METADATA_LOADED);
    });

    $video.on('progress', function () {
      eventEmitter.emit(VIDEO_EVENTS.CHUNK_LOADED);
    });

    $video.on('loadstart', () => {
      eventEmitter.emit(VIDEO_EVENTS.LOAD_STARTED);
    });

    $video.on('durationchange', function () {
      eventEmitter.emit(VIDEO_EVENTS.DURATION_UPDATED);
    });

    $video.on('timeupdate', function () {
      eventEmitter.emit(VIDEO_EVENTS.CURRENT_TIME_UPDATED);
    });

    $video.on('seeking', function () {
      eventEmitter.emit(VIDEO_EVENTS.SEEK_STARTED);
    });

    $video.on('seeked', function () {
      eventEmitter.emit(VIDEO_EVENTS.SEEK_ENDED);
    });
  }
};

export default Player;
