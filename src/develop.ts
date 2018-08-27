import Playable from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';
import Subtitles from './modules/ui/subtitles/subtitles';
import { PreloadTypes } from './modules/playback-engine/types';

const DEFAULT_URLS: any = {
  DASH: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  HLS:
    'https://files.wixstatic.com/files/video/64b2fa_039e5c16db504dbaad166ba28d377744/repackage/hls',
  MP4:
    'https://wixmp-01bd43eabd844aac9eab64f5.wixmp.com/videos/output/720p/Highest Peak.mp4',
  'MP4-VERTICAL':
    'https://storage.googleapis.com/video-player-media-server-static/videoplayback.mp4',
};

Playable.registerModule('subtitles', Subtitles);
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
      height: 600,
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

  const selectVideo = (type: string) => {
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
    if (type === 'MP4-VERTICAL') {
      player.setSrc({
        type: 'MP4',
        url: DEFAULT_URLS[type],
      });
      player.setTitle(`${type}`);
    } else {
      selectVideo(type);
    }
  });

  document.getElementById('theme-switcher').addEventListener('click', event => {
    const { color } = (event.target as any).dataset;
    if (!color) {
      return;
    }

    player.updateTheme({ progressColor: color, color });
  });

  player.attachToElement(document.getElementById('player-wrapper'));
});
