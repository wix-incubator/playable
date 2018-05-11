import * as playerFactoryMethods from './core/player-factory';
import { modules as DefaultModules } from './core/default-modules';
import playerAPIDecorator from './core/player-api-decorator';
import {
  ERRORS,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MediaStreamTypes as MEDIA_STREAM_TYPES,
  MediaStreamDeliveryPriority as MEDIA_STREAM_DELIVERY_PRIORITY,
  EngineState as ENGINE_STATES,
  LiveState as LIVE_STATES,
  VideoViewMode as VIDEO_VIEW_MODES,
} from './constants';
import { Tooltip } from './modules/ui/core/tooltip';
import { IPlaybackAdapter } from './modules/playback-engine/adapters/types';

export {
  ERRORS,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_PRIORITY,
  ENGINE_STATES,
  LIVE_STATES,
  VIDEO_VIEW_MODES,
  Tooltip,
  playerAPIDecorator,
  DefaultModules,
  IPlaybackAdapter,
};

export * from './core/player-factory';

export default {
  ...playerFactoryMethods,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_PRIORITY,
  ENGINE_STATES,
  LIVE_STATES,
  VIDEO_VIEW_MODES,
  Tooltip,
  playerAPIDecorator,
  DefaultModules,
};
