import {
  create,
  registerModule,
  registerPlaybackAdapter,
  MEDIA_STREAM_TYPES,
  PRELOAD_TYPES,
} from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';
import Subtitles from './modules/ui/subtitles/subtitles';
import { IPlayableSource } from './modules/playback-engine/types';

const DEFAULT_URLS: any = {
  DASH: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  HLS:
    'https://files.wixstatic.com/files/video/64b2fa_039e5c16db504dbaad166ba28d377744/repackage/hls',
  MP4:
    'https://storage.googleapis.com/video-player-media-server-static/test2.mp4',
  'MP4-VERTICAL':
    'https://storage.googleapis.com/video-player-media-server-static/videoplayback.mp4',
};

registerModule('subtitles', Subtitles);
registerPlaybackAdapter(HLSAdapter);
registerPlaybackAdapter(DASHAdapter);
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

function createPlayer(
  containerId: string,
  videoType: MEDIA_STREAM_TYPES | 'MP4-VERTICAL',
) {
  const player = create({
    preload: PRELOAD_TYPES.METADATA,
    width: 800,
    height: 450,
    playsinline: true,
    hideOverlay: true,
  });
  player.showLogo();

  player.attachToElement(document.getElementById(containerId));

  selectVideo(player, videoType);

  return player;
}

function selectVideo(player: any, type: MEDIA_STREAM_TYPES | 'MP4-VERTICAL') {
  let _type = type;
  const url = DEFAULT_URLS[type];
  if (_type === 'MP4-VERTICAL') {
    _type = MEDIA_STREAM_TYPES.MP4;
  }

  player.setSrc({
    type: _type,
    url,
  } as IPlayableSource);
  player.setTitle(`${type}`);
}

document.addEventListener('DOMContentLoaded', () => {
  const player = createPlayer('player-wrapper', MEDIA_STREAM_TYPES.MP4);

  Object.defineProperty(window, 'player', {
    value: player,
  });

  document.getElementById('types').addEventListener('click', event => {
    const { type } = (event.target as any).dataset;
    if (!type) {
      return;
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

  player.setFramesMap(config);

  createPlayer('player-wrapper2', 'MP4-VERTICAL');
  createPlayer('player-wrapper3', MEDIA_STREAM_TYPES.DASH);
});
