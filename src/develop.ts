import VideoPlayer from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';
import { PreloadTypes } from './default-modules/playback-engine/playback-engine';
/* ignore coverage */
const DEFAULT_URL = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

VideoPlayer.registerPlaybackAdapter(HLSAdapter);
VideoPlayer.registerPlaybackAdapter(DASHAdapter);

/* ignore coverage */
const player: any = VideoPlayer.create({
  preload: PreloadTypes.METADATA,
  title: {
    text:
      'I hate this video! I hate this video! I hate this video! I hate this video! I hate this video! I hate this video! I hate this video! I hate this video!',
  },
  size: {
    width: 550,
    height: 310,
  },
  src: DEFAULT_URL,
  playInline: true,
  overlay: false,
});

Object.defineProperty(window, 'player', {
  value: player,
});

Object.defineProperty(window, 'VideoPlayer', {
  value: VideoPlayer,
});

/* ignore coverage */
document.addEventListener('DOMContentLoaded', () => {
  player.attachToElement(document.getElementById('player-wrapper'));

  const themeSwitcher = document.getElementById('theme-switcher');
  themeSwitcher.addEventListener('click', ev => {
    const { color } = (ev.target as any).dataset;
    if (!color) {
      return;
    }

    player.updateTheme({ color });
  });
});
