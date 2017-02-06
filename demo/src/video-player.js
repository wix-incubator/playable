import React, { Component } from 'react';
import VideoPlayer from 'video-player';

export default class VideoPlayerWrapper extends Component {
  constructor(props) {
    super(props);

    this.player = new VideoPlayer({
      width: 700,
      height: 394,
      muted: false,
      src: [
        'https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      ],
      enableLogger: true,
      ui: {
        enableControls: true,
        enableOverlay: true
      },
      poster: 'https://pbs.twimg.com/media/C3iThsgWcAAyXhm.jpg:large'
    });
  }

  render() {
    const player = this.player;

    return (
      <div ref={node => node.appendChild(player.node)}>
      </div>
    )
  }
}
