import Vidi from 'vidi';

import getUI from './ui/ui';


function Player(node, src) {
  const _videoNode = node.cloneNode(false);
  _videoNode.removeAttribute('controls');
  const _vidi = connectVideoNodeToVidi(_videoNode);

  const _wrapper = getUI({
    onPlayClick: () => _vidi.play(),
    onPauseClick: () => _vidi.pause()
  });

  _wrapper.appendChild(_videoNode);

  node.parentNode.insertBefore(_wrapper, node);
  node.parentNode.removeChild(node);

  return _vidi;

  function connectVideoNodeToVidi(videoNode) {
    const _vidi = new Vidi(videoNode);
    _vidi.src = src || videoNode.getAttribute('src');

    return _vidi;
  }

}

export default Player;
