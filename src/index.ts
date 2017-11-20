import create, { registerModule, registerPlaybackAdapter } from './core/player-fabric';

import playerAPIDecorator from './utils/player-api-decorator';

import { UI_EVENTS, VIDEO_EVENTS, TEXT_LABELS, MEDIA_STREAM_TYPES, MEDIA_STREAM_DELIVERY_TYPE, STATES as ENGINE_STATES } from './constants';

import DefaultControls from './default-modules/ui/controls/default-controls';

import Overlay from './default-modules/ui/overlay/overlay.controler';
import Loader from './default-modules/ui/loader/loader.controler';
import Screen from './default-modules/ui/screen/screen.controler';
import ControlBlock from './default-modules/ui/controls/controls.controler';

import AnomalyBloodhound from './default-modules/anomaly-bloodhound/anomaly-bloodhound';
import RootContainer from './default-modules/root-container/root-container.controler';
import FullScreenManager from './default-modules/full-screen-manager/full-screen-manager';
import PlayerFacade from './core/player-facade';

/* ignore coverage */
const DefaultUIComponents = {
  Screen,
  Overlay,
  ControlBlock,
  Loader,
};

/* ignore coverage */
const DefaultModules = {
  AnomalyBloodhound,
  RootContainer,
  FullScreenManager,
  PlayerFacade,
};

export {
  DefaultUIComponents,
  DefaultControls,
  DefaultModules,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  ENGINE_STATES,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
  playerAPIDecorator,
  create,
  registerModule,
  registerPlaybackAdapter,
};

export default {
  DefaultUIComponents,
  DefaultControls,
  DefaultModules,
  UI_EVENTS,
  VIDEO_EVENTS,
  ENGINE_STATES,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
  playerAPIDecorator,
  create,
  registerModule,
  registerPlaybackAdapter,
};
