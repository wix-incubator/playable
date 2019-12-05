import { boolean } from '@storybook/addon-knobs';

import {
  create,
  MEDIA_STREAM_TYPES,
  PRELOAD_TYPES,
  registerModule,
  registerPlaybackAdapter,
} from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';
import Subtitles from './modules/ui/subtitles/subtitles';
import ChromecastButton from './modules/ui/controls/chromecast/chromecast';
import ChromecastManager from './modules/chromecast-manager/chromecast-manager';
import * as React from 'react';

const DEFAULT_URLS: any = {
  DASH: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  HLS:
    'https://files.wixstatic.com/files/video/64b2fa_039e5c16db504dbaad166ba28d377744/repackage/hls',
  MP4:
    'https://storage.googleapis.com/video-player-media-server-static/test2.mp4',
  'MP4-VERTICAL':
    'https://storage.googleapis.com/video-player-media-server-static/videoplayback.mp4',
  /**
   * start LIVE media
   *
   * Flow:
   * go to https://video-player-media-server-dot-wixgamma.appspot.com
   * click START
   */
  LIVE:
    'https://video-player-media-server-dot-wixgamma.appspot.com/live/stream/manifest.m3u8',
};

registerModule('subtitles', Subtitles);
registerModule('chromecastManager', ChromecastManager);
registerModule('chromecastButton', ChromecastButton);

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

const rtl = boolean('RTL', false);

const Wrapper = () => <div id="player-wrapper"></div>;

export const Default = () => {
  // const btn = document.createElement('button');
  // btn.type = 'button';
  // btn.innerText = 'Hello Button';
  // btn.addEventListener('click', e => console.log(e));

  document.addEventListener('DOMContentLoaded', () => {
    console.log('haha')
  });

  setTimeout(() => {
    const player = create({
      preload: PRELOAD_TYPES.METADATA,
      width: 600,
      height: 350,
      playsinline: true,
      rtl,
    });

    console.log(rtl);

    player.showLogo();

    Object.defineProperty(window, 'player', {
      value: player,
    });

    const selectVideo = (type: MEDIA_STREAM_TYPES, url?: string) => {
      player.setSrc({
        type,
        url: url || DEFAULT_URLS[type],
      });
      player.setTitle(`${type} format`);
    };

    selectVideo(MEDIA_STREAM_TYPES.HLS);

    player.attachToElement(document.getElementById('player-wrapper'));
    player.setFramesMap(config);
    player.showLiveIndicator();
  }, 1000);

  return <Wrapper />;
};

export default {
  title: 'Demo',
};
