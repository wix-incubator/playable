const VIDEO_EVENTS = {
  ERROR: 'video-events/error',
  STATE_CHANGED: 'video-events/state-changed',
  LIVE_STATE_CHANGED: 'video-events/live-state-changed',
  DYNAMIC_CONTENT_ENDED: 'video-events/dynamic-content-ended',
  CHUNK_LOADED: 'video-events/chunk-loaded',
  CURRENT_TIME_UPDATED: 'video-events/current-time-updated',
  DURATION_UPDATED: 'video-events/duration-updated',
  VOLUME_STATUS_CHANGED: 'video-events/volume-status-changed',
  VOLUME_CHANGED: 'video-events/volume-changed',
  MUTE_CHANGED: 'video-events/mute-changed',
  SEEK_IN_PROGRESS: 'video-events/seek-in-progress',
  UPLOAD_STALLED: 'video-events/upload-stalled',
  UPLOAD_SUSPEND: 'video-events/upload-suspend',
  PLAY_REQUEST_TRIGGERED: 'video-events/play-request-triggered',
  PLAY_ABORTED: 'video-events/play-aborted',
  RESET: 'video-events/reset-playback',
};

export default VIDEO_EVENTS;
