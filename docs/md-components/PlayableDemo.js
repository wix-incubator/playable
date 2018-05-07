import React, { PureComponent } from 'react';
import styles from './PlayableDemo.module.scss';

const VIDEO_SRC =
  'https://wixmp-01bd43eabd844aac9eab64f5.wixmp.com/videos/output/720p/Highest Peak.mp4';
const POSTER_SRC =
  'https://images-vod.wixmp.com/d0220cbc-4355-4bc0-8ebe-53e9ab8843ba/images/23a7996667c04ebc8bd7e9b6141e30cb~mv2/v1/fill/w_744,h_418,q_85,usm_0.66_1.00_0.01/file.jpg';
const LOGO_SRC =
  'https://wixmp-01bd43eabd844aac9eab64f5.wixmp.com/images/White+Wix+logo+Assets+Transparent.png';

class PlayableDemo extends PureComponent {
  constructor(props) {
    super(props);

    this.onRef = this.onRef.bind(this);
  }

  onRef(node) {
    this.node = node;
  }

  componentDidMount() {
    this.player = Playable.create({
      src: VIDEO_SRC,
      title: {
        text: 'Playable Demo',
      },
      logo: {
        src: LOGO_SRC,
      },
      overlay: {
        poster: POSTER_SRC,
      },
    });
    this.player.attachToElement(this.node);
    this.player.setFillAllSpace(true);
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  render() {
    return <div className={styles.playableDemo} ref={this.onRef} />;
  }
}

export default PlayableDemo;
