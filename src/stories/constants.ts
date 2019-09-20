export const RGB_HEX = require('rgb-hex');

export const DEFAULT_URLS: any = {
  DASH: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  HLS:
    'https://files.wixstatic.com/files/video/64b2fa_039e5c16db504dbaad166ba28d377744/repackage/hls',
  MP4:
    'https://storage.googleapis.com/video-player-media-server-static/test2.mp4',
  'MP4-VERTICAL':
    'https://storage.googleapis.com/video-player-media-server-static/videoplayback.mp4',
  LIVE:
    'https://video-player-media-server-dot-wixgamma.appspot.com/live/stream/manifest.m3u8',
};

export const DEFAUTL_CONFIG = {
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

export const MODE_OPTIONS = { REGULAR: 'REGULAR', PREVIEW: 'PREVIEW' };
