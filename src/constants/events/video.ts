const VIDEO_EVENTS = {
  ERROR: 'error',
  STATE_CHANGED: 'state-changed',
  LIVE_STATE_CHANGED: 'live-state-changed',
  DYNAMIC_CONTENT_ENDED: 'dynamic-content-ended',
  CHUNK_LOADED: 'chunk-loaded',
  CURRENT_TIME_UPDATED: 'current-time-updated',
  DURATION_UPDATED: 'duration-updated',
  VOLUME_STATUS_CHANGED: 'volume-status-changed',
  SEEK_IN_PROGRESS: 'seek-in-progress',
  UPLOAD_STALLED: 'upload-stalled',
  UPLOAD_SUSPEND: 'upload-suspend',
  PLAY_REQUEST_TRIGGERED: 'play-request-triggered',
  PLAY_ABORTED: 'play-aborted',
  UNKNOWN: 'unknown',
};

export default VIDEO_EVENTS;
