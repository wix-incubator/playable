import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import {
  create,
  IPlayerInstance,
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
import { IPlayerConfig } from './core/config';

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

type StoryProps = IPlayerConfig & {}

class Story extends React.Component<StoryProps> {
  private readonly rootRef: React.RefObject<HTMLDivElement>;
  private player: IPlayerInstance;

  constructor(props: StoryProps) {
    super(props);
    this.rootRef = React.createRef();
  }

  componentDidMount() {
    const player = create({
      preload: PRELOAD_TYPES.METADATA,
      width: 600,
      height: 350,
      playsinline: true,
    });

    this.player = player;


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

    player.attachToElement(this.rootRef.current);
    player.setFramesMap(config);
    player.showLiveIndicator();
  }

  private processNewProps = (newProps: Partial<StoryProps>, player: IPlayerInstance) => {
    const propsToMethod = {
      rtl: (value: boolean) => player.setRtl(value),
      width: (value: number) => player.setWidth(value),
      height: (value: number) => player.setHeight(value),
    };

    Object.entries(newProps).forEach(([newPropKey, newPropValue]) => {
      (propsToMethod as any)[newPropKey](newPropValue);
    })
  };

  componentDidUpdate(prevProps: StoryProps) {
    const updatedProps = Object.keys(this.props).reduce((acc, property: any) => {
      const newValue = (this.props as any)[property];
      const oldValue = (prevProps as any)[property];

      if (newValue !== oldValue) {
        (acc as any)[property] = newValue;
      }

      return acc;
    }, {} as Partial<StoryProps>);

    this.processNewProps(updatedProps, this.player);
  }

  render() {
    return <div ref={this.rootRef}/>;
  }
}

storiesOf('Story', module).add('default', () => {
  return <Story
      rtl={boolean('RTL', false)}
      width={Number(text('Width', '600'))}
      height={Number(text('Height', '600'))}
  />
});
