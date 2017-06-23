import { MediaStreamTypes } from 'vidi';

import create, { registerModule } from './core/player-fabric';
import UI_EVENTS from './constants/events/ui';
import VIDEO_EVENTS from './constants/events/video';
import { STATES as ENGINE_STATES } from './playback-engine/playback-engine';

import DefaultControls from './ui/controls/default-controls';

import Overlay from './ui/overlay/overlay.controler';
import Loader from './ui/loader/loader.controler';
import Screen from './ui/screen/screen.controler';
import ControlBlock from './ui/controls/controls.controler';

import AnomalyBloodhound from './anomaly-bloodhound/anomaly-bloodhound';
import UI from './ui/ui.controler';
import FullScreenManager from './full-screen-manager/full-screen-manager';

const DefaultUIComponents = {
  Screen,
  Overlay,
  ControlBlock,
  Loader
};

const DefaultModules = {
  AnomalyBloodhound,
  UI,
  FullScreenManager
};

export {
  DefaultUIComponents,
  DefaultControls,
  DefaultModules,
  UI_EVENTS,
  VIDEO_EVENTS,
  ENGINE_STATES,
  MediaStreamTypes,
  create,
  registerModule
};

export default {
  DefaultUIComponents,
  DefaultControls,
  DefaultModules,
  UI_EVENTS,
  VIDEO_EVENTS,
  ENGINE_STATES,
  MediaStreamTypes,
  create,
  registerModule
};
