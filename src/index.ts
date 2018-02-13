import * as playerFactoryMethods from './core/player-factory';
export * from './core/player-factory';

import {
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
  STATES as ENGINE_STATES,
  LiveState as LIVE_STATES,
} from './constants';

export {
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
  ENGINE_STATES,
  LIVE_STATES,
};

import { modules as DefaultModules } from './default-modules';

import playerAPIDecorator from './utils/player-api-decorator';
export { playerAPIDecorator };

export { Tooltip } from './default-modules/ui/core/tooltip';

export { modules as DefaultModules } from './default-modules';

const defaultExport = {
  ...playerFactoryMethods,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
  ENGINE_STATES,
  LIVE_STATES,
  DefaultModules,
};

export default defaultExport;
