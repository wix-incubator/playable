import Playable from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';
import { PreloadTypes } from './default-modules/playback-engine/playback-engine';

const DEFAULT_URLS = {
  DASH: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  HLS:
    'https://files.wixstatic.com/files/video/64b2fa_039e5c16db504dbaad166ba28d377744/repackage/hls',
  MP4:
    'https://wixmp-01bd43eabd844aac9eab64f5.wixmp.com/videos/output/720p/Highest Peak.mp4',
};

Playable.registerPlaybackAdapter(HLSAdapter);
Playable.registerPlaybackAdapter(DASHAdapter);

Object.defineProperty(window, 'Playable', {
  value: Playable,
});

document.addEventListener('DOMContentLoaded', () => {
  const player: any = Playable.create({
    preload: PreloadTypes.METADATA,
    size: {
      width: 800,
      height: 450,
    },
    playInline: true,
    overlay: false,
    logo: {
      src: '',
    },
  });

  Object.defineProperty(window, 'player', {
    value: player,
  });

  const selectVideo = type => {
    player.setSrc({
      type,
      url: DEFAULT_URLS[type],
    });
    player.setTitle(`${type} format`);
  };

  selectVideo('MP4');

  document.getElementById('types').addEventListener('click', event => {
    const { type } = (event.target as any).dataset;
    if (!type) {
      return;
    }

    selectVideo(type);
  });

  document.getElementById('theme-switcher').addEventListener('click', event => {
    const { color } = (event.target as any).dataset;
    if (!color) {
      return;
    }

    player.updateTheme({ progressColor: color });
  });

  player.attachToElement(document.getElementById('player-wrapper'));
});
