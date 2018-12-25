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
    'https://storage.googleapis.com/video-player-media-server-static/test2.mp4',
  'MP4-VERTICAL':
    'https://storage.googleapis.com/video-player-media-server-static/videoplayback.mp4',
};

Playable.registerModule('subtitles', Subtitles);
Playable.registerPlaybackAdapter(HLSAdapter);
Playable.registerPlaybackAdapter(DASHAdapter);
const config = {
  framesCount: 178,
  qualities: [
    {
      spriteUrlMask:
        'https://storage.googleapis.com/video-player-media-server-static/thumbnails/low_rez_sprite_%d.jpg',
      frameSize: { width: 90, height: 45 },
      framesInSprite: { vert: 10, horz: 10 },
    },
    {
      spriteUrlMask:
        'https://storage.googleapis.com/video-player-media-server-static/thumbnails/high_rez_sprite_%d.jpg',
      frameSize: { width: 180, height: 90 },
      framesInSprite: { vert: 5, horz: 5 },
    },
  ],
};
Object.defineProperty(window, 'Playable', {
  value: Playable,
});

document.addEventListener('DOMContentLoaded', () => {
  const player: any = Playable.create({
    preload: PreloadTypes.METADATA,
    width: 800,
    height: 450,
    playsinline: true,
    hideOverlay: true,
  });
  player.showLogo();

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

  document
    .getElementById('progress-bar-modes')
    .addEventListener('click', event => {
      const { mode } = (event.target as any).dataset;
      if (!mode) {
        return;
      }

      if (mode === 'REGULAR') {
        player.seekOnProgressDrag();
      } else if (mode === 'PREVIEW') {
        player.showPreviewOnProgressDrag();
      }
    });
  player.setTitle('Really really really really ');
  player.attachToElement(document.getElementById('player-wrapper'));
  player.setFramesMap(config);
});
