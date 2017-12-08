import VideoPlayer from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';

/* ignore coverage */
const DEFAULT_URL = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

VideoPlayer.registerPlaybackAdapter(HLSAdapter);
VideoPlayer.registerPlaybackAdapter(DASHAdapter);

/* ignore coverage */
const player: any = VideoPlayer.create({
  autoPlay: false,
  muted: false,
  loop: false,
  preload: 'metadata',
  volume: 100,
  title: 'I hate this video',
  fillAllSpace: false,
  size: {
    width: 760,
    height: 428,
  },
  src: DEFAULT_URL,
  controls: {
    shouldAlwaysShow: true,
    logo: {
      showAlways: false,
      src:
        'https://www.file-extensions.org/imgs/app-icon/128/10395/wix-icon.png',
    },
  },
  overlay: false,
});

Reflect.defineProperty(window, 'player', {
  value: player,
});

/* ignore coverage */
document.addEventListener('DOMContentLoaded', () => {
  player.attachToElement(document.getElementById('player-wrapper'));
});
