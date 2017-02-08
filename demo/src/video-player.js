import React, { Component } from 'react';
import VideoPlayer from 'video-player';

const DEFAULT_PROPS = {
  width: 700,
  height: 394,
  autoplay: false,
  muted: false,
  loop: true,
  nativeControls: false,
  preload: 'none',
  poster: 'https://pbs.twimg.com/media/C3iThsgWcAAyXhm.jpg:large',

  src: [
    'https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
  ],

  overlay: true,
  controls: true,
  timeIndicator: true,
  progressControl: true,
  volumeControl: true,
  volume: 100,
  fullscreenControl: true
};

export default class VideoPlayerWrapper extends Component {
  constructor(props) {
    super(props);

    this.player = new VideoPlayer(Object.assign({}, DEFAULT_PROPS, props));
  }

  render() {
    const player = this.player;

    return (
      <div ref={node => node.appendChild(player.node)}>
      </div>
    )
  }
}
