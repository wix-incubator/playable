import create, { registerModule } from './core/player-fabric';

import { UI_EVENTS, VIDEO_EVENTS, MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE } from './constants';
import { STATES as ENGINE_STATES } from './playback-engine/playback-engine';

import DefaultControls from './ui/controls/default-controls';

import Overlay from './ui/overlay/overlay.controler';
import Loader from './ui/loader/loader.controler';
import Screen from './ui/screen/screen.controler';
import ControlBlock from './ui/controls/controls.controler';

import AnomalyBloodhound from './anomaly-bloodhound/anomaly-bloodhound';
import UI from './ui/ui.controler';
import FullScreenManager from './full-screen-manager/full-screen-manager';
import PlayerFacade from './core/player-facade';

const DefaultUIComponents = {
  Screen,
  Overlay,
  ControlBlock,
  Loader
};

const DefaultModules = {
  AnomalyBloodhound,
  UI,
  FullScreenManager,
  PlayerFacade
};

export {
  DefaultUIComponents,
  DefaultControls,
  DefaultModules,
  UI_EVENTS,
  VIDEO_EVENTS,
  ENGINE_STATES,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
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
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
  create,
  registerModule
};
