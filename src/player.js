import Vidi from 'vidi';
import $ from 'jbone';

import getUI from './ui/ui';


function Player(src) {
  const videoNode = $('<video>');

  const vidi = new Vidi(videoNode[0]);
  vidi.src = src;

  const wrapper = getUI({
    videoNode,
    onPlayClick: () => vidi.play(),
    onPauseClick: () => vidi.pause()
  });

  return  {
    node: wrapper[0]
  };
}

export default Player;
