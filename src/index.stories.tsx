import * as React from 'react';
import { button, boolean, color, number, select } from '@storybook/addon-knobs';
import {
  RGB_HEX,
  DEFAUTL_CONFIG,
  DEFAULT_URLS,
  MODE_OPTIONS,
} from './stories/constants';
import { storiesOf } from '@storybook/react';

import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';
import Subtitles from './modules/ui/subtitles/subtitles';
import ChromecastButton from './modules/ui/controls/chromecast/chromecast';
import ChromecastManager from './modules/chromecast-manager/chromecast-manager';

import {
  create,
  IPlayerInstance,
  MEDIA_STREAM_TYPES,
  PRELOAD_TYPES,
  registerModule,
  registerPlaybackAdapter,
} from './index';
import {StoryProps, StoryWindow} from './stories/types'
import {MediaStreamType} from "./constants";

registerModule('subtitles', Subtitles);
registerModule('chromecastManager', ChromecastManager);
registerModule('chromecastButton', ChromecastButton);
registerPlaybackAdapter(HLSAdapter);
registerPlaybackAdapter(DASHAdapter);

declare let window: StoryWindow;

const videoTypeOptions = Object.keys(DEFAULT_URLS) as MediaStreamType[];

class Story extends React.Component<StoryProps> {
  private readonly rootRef: React.RefObject<HTMLDivElement>;
  private player: IPlayerInstance;

  constructor(props: StoryProps) {
    super(props);
    this.rootRef = React.createRef();
  }

  private _processProps = (newProps: Partial<StoryProps>, player: IPlayerInstance) => {
    const propsToMethod = {
      fillAllSpace: (value: boolean) => player.setFillAllSpace(value),
      rtl: (value: boolean) => player.setRtl(value),
      width: (value: number) => player.setWidth(value),
      height: (value: number) => player.setHeight(value),
      videoType: (value: string) => {
        const type = (value === 'LIVE'
          ? MediaStreamType.HLS
          : value === 'MP4-VERTICAL'
            ? MediaStreamType.MP4
            : value) as MediaStreamType;

        player.setSrc({
          type,
          url: DEFAULT_URLS[value],
        });

        player.setTitle(`${value} format`);
      },
      color: (value: string) => {
        player.updateTheme({ progressColor: value, color: value });
      },
      progressBarMode: (value: string) => {
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

  public componentDidMount() {
    const player = create({
      preload: PRELOAD_TYPES.METADATA,
      playsinline: true,
    });

    this.player = player;
    window.player = player;

    this._processProps(this.props, this.player);

    player.showLogo();
    player.attachToElement(this.rootRef.current);
    player.setFramesMap(DEFAUTL_CONFIG);
  }

  public componentDidUpdate(prevProps: StoryProps) {
    const updatedProps = Object.keys(this.props).reduce((acc: any, property: any) => {
      const newValue = (this.props as any)[property];
      const oldValue = (prevProps as any)[property];

      if (newValue !== oldValue) {
        acc[property] = newValue;
      }

      return acc;
    }, {} as Partial<StoryProps>);

    this._processProps(updatedProps, this.player);
  }

  public render() {
    return <div className="story-root" ref={this.rootRef}/>;
  }
}

storiesOf('Story', module).add('default', () => {
  const groupDefault = 'Default';
  const groupActions = 'Actions';
  const playerColor = color('color', '#fff', 'Default');
  const getPlayerColor = () => playerColor.includes('rgba') ? `#${RGB_HEX(playerColor).slice(0, -2)}` : playerColor;

  button('Stop',() => window.player.pause(), groupActions);
  button('Play', () => window.player.play(), groupActions);

  return <Story
    rtl={boolean('rtl', false, groupDefault)}
    fillAllSpace={boolean('fillAllSpace', false, groupDefault)}
    width={number('width', 600,  {}, groupDefault)}
    height={number('height', 350, {}, groupDefault)}
    videoType={select('videoType', videoTypeOptions , MEDIA_STREAM_TYPES.HLS, groupDefault)}
    color={getPlayerColor()}
    progressBarMode={select('progressBarMode', MODE_OPTIONS, MODE_OPTIONS.REGULAR,  groupDefault)}
  />
});
