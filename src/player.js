import Vidi from 'vidi';
import $ from 'jbone';

import getUI from './ui/ui';


function Player({src, ...params}) {
  const $video = $('<video/>', params);

  const vidi = new Vidi($video[0]);
  vidi.src = src;

  this._wrapper = getUI({
    $video,
    onPlayClick: () => vidi.play(),
    onPauseClick: () => vidi.pause()
  });
}

Player.prototype = {

  /**
   * Getter for DOM node with player
   * @return {Node}
   */
  get node() {
    return this._wrapper[0];
  }
};

export default Player;
