import { button, boolean, color, number, select } from '@storybook/addon-knobs';

import { DEFAULT_URLS, MODE_OPTIONS, RGB_HEX } from './stories/constants';
import { MEDIA_STREAM_TYPES } from './index';

import { MediaStreamType } from './constants';
import { storiesOf } from '@storybook/html';
import { createPlayerStory } from './stories/createPlayerStory';

const videoTypeOptions = Object.keys(DEFAULT_URLS) as MediaStreamType[];

const story = storiesOf('Default', module);

story.add('Default', () => {
  const groupDefault = 'Default';
  const groupActions = 'actions';

  const height = number('height', 350, {}, groupDefault);
  const width = number('width', 600, {}, groupDefault);

  const fillAllSpace = boolean('fillAllSpace', false, groupDefault);
  const rtl = boolean('rtl', false, groupDefault);

  const videoType = select(
    'videoType',
    videoTypeOptions,
    MEDIA_STREAM_TYPES.HLS,
    groupDefault,
  );
  const progressBarMode = select(
    'progressBarMode',
    MODE_OPTIONS,
    MODE_OPTIONS.REGULAR,
    groupDefault,
  );

  const playerColor = color('color', '#fff', 'Default');
  const playerColorHex = playerColor.includes('rgba')
    ? `#${RGB_HEX(playerColor).slice(0, -2)}`
    : playerColor;

  const props = {
    rtl,
    fillAllSpace,
    width,
    height,
    videoType,
    progressBarMode,
    color: playerColorHex,
  };

  const { storyContainer, player } = createPlayerStory('Default', props);

  button('Stop', () => player.pause(), groupActions);
  button('Play', () => player.play(), groupActions);

  return storyContainer;
});
