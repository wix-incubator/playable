import { button, boolean, color, number, select } from '@storybook/addon-knobs';
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

const rgbHex = require('rgb-hex');

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

type StoryProps = IPlayerConfig & {
  _videoType: MEDIA_STREAM_TYPES;
  _color: string;
  _progressBarMode: 'REGULAR' | 'PREVIEW';
}

class Story extends React.Component<StoryProps> {
  private readonly rootRef: React.RefObject<HTMLDivElement>;
  private player: IPlayerInstance;

  constructor(props: StoryProps) {
    super(props);
    this.rootRef = React.createRef();
  }

  private processProps = (newProps: Partial<StoryProps>, player: IPlayerInstance) => {
    const propsToMethod = {
      fillAllSpace: (value: boolean) => player.setFillAllSpace(value),
      rtl: (value: boolean) => player.setRtl(value),
      width: (value: number) => player.setWidth(value),
      height: (value: number) => player.setHeight(value),
      _videoType: (value: any) => {
        let type;

        if (value === 'MP4-VERTICAL') {
          type = MEDIA_STREAM_TYPES.MP4;
        } else if (value === 'LIVE') {
          type = MEDIA_STREAM_TYPES.HLS;
        } else {
          type = value;
        }

        player.setSrc({
          type,
          url: DEFAULT_URLS[value],
        });

        player.setTitle(`${value} format`);
      },
      _color: (value: string) => {
        player.updateTheme({ progressColor: value, color: value });
      },
      _progressBarMode: (value: string) => {
        if (value === 'REGULAR') {
          player.seekOnProgressDrag();
        } else if (value === 'PREVIEW') {
          player.showPreviewOnProgressDrag();
        }
      },
    };

    Object.entries(newProps).forEach(([newPropKey, newPropValue]) => {
      (propsToMethod as any)[newPropKey](newPropValue);
    })
  };

  componentDidMount() {
    const player = create({
      preload: PRELOAD_TYPES.METADATA,
      playsinline: true,
    });

    this.player = player;
    (window as any).player = player;

    this.processProps(this.props, this.player);

    player.showLogo();
    player.attachToElement(this.rootRef.current);
    player.setFramesMap(config);
  }

  componentDidUpdate(prevProps: StoryProps) {
    const updatedProps = Object.keys(this.props).reduce((acc, property: any) => {
      const newValue = (this.props as any)[property];
      const oldValue = (prevProps as any)[property];

      if (newValue !== oldValue) {
        (acc as any)[property] = newValue;
      }

      return acc;
    }, {} as Partial<StoryProps>);

    this.processProps(updatedProps, this.player);
  }

  render() {
    return <div className="story-root"
                ref={this.rootRef}/>;
  }
}

storiesOf('Story', module).add('default', () => {
  const playerColor = color('color', '#fff');

  button('Stop', () => {
    (window as any).player.pause();
  });

  button('Play', () => {
    (window as any).player.play();
  });

  return <Story
    rtl={boolean('rtl', false, 'Default')}
    fillAllSpace={boolean('fillAllSpace', false)}
    width={number('width', 600)}
    height={number('height', 350)}
    _videoType={select(
      '_videoType',
      Object.keys(DEFAULT_URLS).reduce((acc, prop) => {
        acc[prop] = prop;
        return acc;
      }, {} as any), MEDIA_STREAM_TYPES.HLS)}
    _color={playerColor.includes('rgba') ? `#${rgbHex(playerColor).slice(0, -2)}` : playerColor}
    _progressBarMode={select('_progressBarMode', { REGULAR: 'REGULAR', PREVIEW: 'PREVIEW' }, 'REGULAR')}
  />
});
