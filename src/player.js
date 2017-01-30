import Vidi from 'vidi';
import $ from 'jbone';

import VIDEO_EVENTS from './constants/events/video';

import eventEmitter from './event-emitter';
import PlayerUI from './ui/ui';


function Player({src, ui, ...params}) {
  const $video = $('<video/>', params);

  const vidi = new Vidi($video[0]);
  vidi.src = src;

  if (ui) {
    this.ui = ui({
      $video,
      eventEmitter
    });
  } else {
    this.ui = new PlayerUI({
      $video
    });
  }

  eventEmitter.on(VIDEO_EVENTS.PLAY, () => {
    vidi.play();
  });

  eventEmitter.on(VIDEO_EVENTS.PAUSE, () => {
    vidi.pause();
  });
}

Player.prototype = {

  /**
   * Getter for DOM node with player
   * @return {Node}
   */
  get node() {
    return this.ui.$wrapper[0];
  }
};

export default Player;
