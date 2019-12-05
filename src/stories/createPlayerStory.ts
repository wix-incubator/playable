import {
  create,
  registerModule,
  registerPlaybackAdapter,
  IPlayerInstance,
  PRELOAD_TYPES,
} from '..';

import { DEFAULT_URLS, DEFAUTL_CONFIG, MODE_OPTIONS } from './constants';
import { MediaStreamType } from '../constants';
import { StoryProps } from './types';
import Subtitles from '../modules/ui/subtitles/subtitles';
import ChromecastManager from '../modules/chromecast-manager/chromecast-manager';
import ChromecastButton from '../modules/ui/controls/chromecast/chromecast';
import HLSAdapter from '../adapters/hls';
import DASHAdapter from '../adapters/dash';

registerModule('subtitles', Subtitles);
registerModule('chromecastManager', ChromecastManager);
registerModule('chromecastButton', ChromecastButton);
registerPlaybackAdapter(HLSAdapter);
registerPlaybackAdapter(DASHAdapter);

let currentStoryId: string = '';
let prevPlayerProps = {};
let rootContainer: any;
let player: any;

const processProps = (props: StoryProps, playerInstance: IPlayerInstance) => {
  const propsToMethod: { [i in keyof StoryProps]: (value: any) => any } = {
    fillAllSpace: (value: boolean) => playerInstance.setFillAllSpace(value),
    rtl: (value: boolean) => playerInstance.setRtl(value),
    width: (value: number) => playerInstance.setWidth(value),
    height: (value: number) => playerInstance.setHeight(value),
    videoType: (value: string) => {
      const type = (value === 'LIVE'
        ? MediaStreamType.HLS
        : value === 'MP4-VERTICAL'
        ? MediaStreamType.MP4
        : value) as MediaStreamType;

      playerInstance.setSrc({
        type,
        url: DEFAULT_URLS[value],
      });

      playerInstance.setTitle(`${value} format`);
    },
    color: (value: string) =>
      playerInstance.updateTheme({ progressColor: value, color: value }),
    progressBarMode: (value: string) => {
      if (value === MODE_OPTIONS.REGULAR) {
        playerInstance.seekOnProgressDrag();
      } else if (value === 'PREVIEW') {
        playerInstance.showPreviewOnProgressDrag();
      }
    },
  };

  Object.entries(props).forEach(
    ([propKey, propValue]: [keyof typeof propsToMethod, any]) => {
      propsToMethod[propKey](propValue);
    },
  );
};

export const createPlayerStory = (storyId: string, playerProps: StoryProps) => {
  if (storyId !== currentStoryId) {
    currentStoryId = storyId;
    prevPlayerProps = {};
    rootContainer = document.createElement('div');
    player = create({
      preload: PRELOAD_TYPES.METADATA,
      playsinline: true,
    });
    player.showLogo();
    player.attachToElement(rootContainer);
    player.setFramesMap(DEFAUTL_CONFIG);
  }

  const updatedProps = Object.keys(playerProps).reduce(
    (acc: any, property: any) => {
      const newValue = (playerProps as any)[property];
      const oldValue = (prevPlayerProps as any)[property];

      if (newValue !== oldValue) {
        acc[property] = newValue;
      }

      return acc;
    },
    {} as Partial<StoryProps>,
  );

  processProps(updatedProps, player);
  prevPlayerProps = { ...playerProps, ...updatedProps };

  return { storyContainer: rootContainer, player };
};
