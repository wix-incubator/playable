import * as playerFactoryMethods from './core/player-factory';
export * from './core/player-factory';

import {
  ERRORS,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MediaStreamTypes as MEDIA_STREAM_TYPES,
  MediaStreamDeliveryPriority as MEDIA_STREAM_DELIVERY_PRIORITY,
  STATES as ENGINE_STATES,
  LiveState as LIVE_STATES,
} from './constants';

export {
  ERRORS,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_PRIORITY,
  ENGINE_STATES,
  LIVE_STATES,
};

import { modules as DefaultModules } from './default-modules';

import playerAPIDecorator from './utils/player-api-decorator';
export { playerAPIDecorator };

export { Tooltip } from './default-modules/ui/core/tooltip';

export {
  IPlaybackAdapter,
} from './default-modules/playback-engine/adapters/types';

export { modules as DefaultModules } from './default-modules';

const defaultExport = {
  ...playerFactoryMethods,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_PRIORITY,
  ENGINE_STATES,
  LIVE_STATES,
  DefaultModules,
};

export default defaultExport;
