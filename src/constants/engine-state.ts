enum EngineState {
  SRC_SET = 'engine-state/src-set',
  LOAD_STARTED = 'engine-state/load-started',
  METADATA_LOADED = 'engine-state/metadata-loaded',
  READY_TO_PLAY = 'engine-state/ready-to-play',
  SEEK_IN_PROGRESS = 'engine-state/seek-in-progress',
  PLAY_REQUESTED = 'engine-state/play-requested',
  WAITING = 'engine-state/waiting',
  PLAYING = 'engine-state/playing',
  PAUSED = 'engine-state/paused',
  ENDED = 'engine-state/ended',
}

export default EngineState;
