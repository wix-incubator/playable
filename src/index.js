import { MediaStreamTypes } from 'vidi';

import Player from './player';
import UI_EVENTS from './constants/events/ui';
import VIDEO_EVENTS from './constants/events/video';
import { STATES as ENGINE_STATES } from './playback-engine/playback-engine';

import DefaultControls from './ui/controls/default-controls';

import Overlay from './ui/overlay/overlay.controler';
import Loader from './ui/loader/loader.controler';
import Screen from './ui/screen/screen.controler';
import ControlBlock from './ui/controls/controls.controler';

import AnomalyBloodhound from './anomaly-bloodhound/anomaly-bloodhound';

const DefaultUIComponents = {
  Screen,
  Overlay,
  ControlBlock,
  Loader
};

const DefaultModules = {
  AnomalyBloodhound
};

export {
  DefaultUIComponents,
  DefaultControls,
  DefaultModules,
  UI_EVENTS,
  VIDEO_EVENTS,
  ENGINE_STATES,
  MediaStreamTypes,
  Player
};

export default {
  DefaultUIComponents,
  DefaultControls,
  UI_EVENTS,
  VIDEO_EVENTS,
  ENGINE_STATES,
  MediaStreamTypes,
  Player
};
