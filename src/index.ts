import create, {
  registerModule,
  registerPlaybackAdapter,
} from './core/player-factory';

import playerAPIDecorator from './utils/player-api-decorator';

export {
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_TYPE,
  STATES as ENGINE_STATES,
  LiveState as LIVE_STATES,
} from './constants';

export { Tooltip } from './default-modules/ui/core/tooltip';

export * from './default-modules';

export { playerAPIDecorator, create, registerModule, registerPlaybackAdapter };

export default {
  create,
  registerModule,
  registerPlaybackAdapter,
};
