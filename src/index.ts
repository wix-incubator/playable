import {
  create,
  registerModule,
  clearAdditionalModules,
  registerPlaybackAdapter,
  clearPlaybackAdapters,
  IPlayerInstance,
} from './core/player-factory';
import { modules as DefaultModules } from './core/default-modules';
import playerAPIDecorator from './core/player-api-decorator';
import {
  ERRORS,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_PRIORITY,
  ENGINE_STATES,
  LIVE_STATES,
} from './constants';

import { Tooltip } from './modules/ui/core/tooltip';
import {
  PreloadType as PRELOAD_TYPES,
  CrossOriginValue as CROSS_ORIGIN_VALUES,
  PlayableMediaSource,
} from './modules/playback-engine/types';
import { IPlaybackAdapter } from './modules/playback-engine/output/native/adapters/types';

import { VideoViewMode as VIDEO_VIEW_MODES } from './modules/ui/screen/types';

export {
  create,
  registerModule,
  clearAdditionalModules,
  registerPlaybackAdapter,
  clearPlaybackAdapters,
  ERRORS,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_PRIORITY,
  ENGINE_STATES,
  LIVE_STATES,
  VIDEO_VIEW_MODES,
  PRELOAD_TYPES,
  CROSS_ORIGIN_VALUES,
  Tooltip,
  playerAPIDecorator,
  DefaultModules,
  IPlayerInstance,
  PlayableMediaSource,
  IPlaybackAdapter,
};

export default {
  create,
  registerModule,
  clearAdditionalModules,
  registerPlaybackAdapter,
  clearPlaybackAdapters,
  ERRORS,
  UI_EVENTS,
  VIDEO_EVENTS,
  TEXT_LABELS,
  MEDIA_STREAM_TYPES,
  MEDIA_STREAM_DELIVERY_PRIORITY,
  ENGINE_STATES,
  LIVE_STATES,
  VIDEO_VIEW_MODES,
  PRELOAD_TYPES,
  CROSS_ORIGIN_VALUES,
  Tooltip,
  playerAPIDecorator,
  DefaultModules,
};
