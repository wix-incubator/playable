import React, { PureComponent } from 'react';
import styles from './PlayableDemo.module.scss';

const VIDEO_SRC =
  'https://wixmp-01bd43eabd844aac9eab64f5.wixmp.com/videos/output/720p/Highest Peak.mp4';

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
