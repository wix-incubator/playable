import Vidi from 'vidi';

export const { PlaybackStatus: VIDI_PLAYBACK_STATUSES } = Vidi;

const VIDEO_EVENTS = {
  PLAYBACK_STATUS_CHANGED: 'playback-status-changed',
  CHUNK_LOADED: 'chunk-loaded',
  METADATA_LOADED: 'metadata-loaded',
  CURRENT_TIME_UPDATED: 'current-time-updated',
  DURATION_UPDATED: 'duration-updated',
  LOAD_STARTED: 'load-started',
  SEEK_STARTED: 'seek-started',
  SEEK_ENDED: 'seek-ended',
  SET_CURRENT_TIME: 'set-current-time',
  VOLUME_STATUS_CHANGED: 'volume-status-changed'
};

export default VIDEO_EVENTS;
