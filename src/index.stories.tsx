import type { Meta, StoryObj } from '@storybook/html';
import { DEFAULT_URLS, MODE_OPTIONS, RGB_HEX } from './stories/constants';
import { MEDIA_STREAM_TYPES } from './index';
import { MediaStreamType } from './constants';
import { createPlayerStory } from './stories/createPlayerStory';

const videoTypeOptions = Object.keys(DEFAULT_URLS) as MediaStreamType[];

const meta: Meta = {
  title: 'Default/Default',
  argTypes: {
    height: { control: { type: 'number' } },
    width: { control: { type: 'number' } },
    fillAllSpace: { control: 'boolean' },
    rtl: { control: 'boolean' },
    videoType: {
      control: 'select',
      options: videoTypeOptions,
    },
    progressBarMode: {
      control: 'select',
      options: Object.values(MODE_OPTIONS),
    },
    color: { control: 'color' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    height: 350,
    width: 600,
    fillAllSpace: false,
    rtl: false,
    videoType: MEDIA_STREAM_TYPES.HLS,
    progressBarMode: MODE_OPTIONS.REGULAR,
    color: '#ffffff',
  },
  render: (args) => {
    const playerColorHex = (args.color as string).includes('rgba')
      ? `#${RGB_HEX(args.color as string).slice(0, -2)}`
      : (args.color as string);

    const props = {
      rtl: args.rtl,
      fillAllSpace: args.fillAllSpace,
      width: args.width,
      height: args.height,
      videoType: args.videoType,
      progressBarMode: args.progressBarMode,
      color: playerColorHex,
    };

    const { storyContainer, player } = createPlayerStory('Default', props);

    const wrap = document.createElement('div');
    wrap.appendChild(storyContainer);

    const actions = document.createElement('div');
    actions.style.marginTop = '8px';
    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.onclick = () => player.pause();
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';
    playBtn.onclick = () => player.play();
    playBtn.style.marginLeft = '8px';
    actions.appendChild(stopBtn);
    actions.appendChild(playBtn);
    wrap.appendChild(actions);

    return wrap;
  },
};
