const UI_EVENTS = {
  PLAY_TRIGGERED: 'ui-events/play-triggered',
  PLAY_OVERLAY_TRIGGERED: 'ui-events/play-overlay-triggered',
  PAUSE_TRIGGERED: 'ui-events/pause-triggered',
  PROGRESS_CHANGE_TRIGGERED: 'ui-events/progress-change-triggered',
  VOLUME_CHANGE_TRIGGERED: 'ui-events/volume-change-triggered',
  MUTE_STATUS_TRIGGERED: 'ui-events/mute-status-triggered',
  FULLSCREEN_STATUS_CHANGED: 'ui-events/fullscreen-status-changed',

  // TODO: follow ENTITY_EVENT_TRIGGERED or ENTITY_EVENT format
  MOUSE_ENTER_ON_PLAYER_TRIGGERED: 'ui-events/mouse-enter-on-player-triggered',
  MOUSE_MOVE_ON_PLAYER_TRIGGERED: 'ui-events/mouse-move-on-player-triggered',
  MOUSE_LEAVE_ON_PLAYER_TRIGGERED: 'ui-events/mouse-leave-on-player-triggered',
  CONTROL_BLOCK_HIDE_TRIGGERED: 'ui-events/control-block-hide-triggered',
  CONTROL_BLOCK_SHOW_TRIGGERED: 'ui-events/control-block-show-triggered',
  PROGRESS_MANIPULATION_STARTED: 'ui-events/progress-manipulation-started',
  PROGRESS_MANIPULATION_ENDED: 'ui-events/progress-manipulation-ended',
  KEYBOARD_KEYDOWN_INTERCEPTED: 'ui-events/keyboard-keydown-intercepted',
  LOADER_SHOW_TRIGGERED: 'ui-events/loader-show-triggered',
  LOADER_HIDE_TRIGGERED: 'ui-events/loader-hide-triggered',
  LOADING_COVER_SHOW_TRIGGERED: 'ui-events/loading-cover-show-triggered',
  LOADING_COVER_HIDE_TRIGGERED: 'ui-events/loading-cover-hide-triggered',
  TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED:
    'ui-events/toggle-playback-with-keyboard-triggered',
  GO_BACKWARD_WITH_KEYBOARD_TRIGGERED:
    'ui-events/go-backward-with-keyboard-triggered',
  GO_FORWARD_WITH_KEYBOARD_TRIGGERED:
    'ui-events/go-forward-with-keyboard-triggered',
  INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED:
    'ui-events/increase-volume-with-keyboard-triggered',
  DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED:
    'ui-events/decrease-volume-with-keyboard-triggered',
  MUTE_SOUND_WITH_KEYBOARD_TRIGGERED:
    'ui-events/mute-sound-with-keyboard-triggered',
  UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED:
    'ui-events/unmute-sound-with-keyboard-triggered',
  HIDE_INTERACTION_INDICATOR_TRIGGERED:
    'ui-events/hide-interaction-indicator-triggered',
  // TODO: get rid of WIDTH/HEIGHT change events in favour of RESIZE
  PLAYER_WIDTH_CHANGE_TRIGGERED: 'ui-events/player-width-change-triggered',
  PLAYER_HEIGHT_CHANGE_TRIGGERED: 'ui-events/player-height-change-triggered',

  PLAY_WITH_SCREEN_CLICK_TRIGGERED:
    'ui-events/play-with-screen-click-triggered',
  PAUSE_WITH_SCREEN_CLICK_TRIGGERED:
    'ui-events/pause-with-screen-click-triggered',

  // TODO: review CONTROL_DRAG_START vs CONTROL_DRAG_START_TRIGGERED format
  CONTROL_DRAG_START: 'ui-events/control-drag-start',
  CONTROL_DRAG_END: 'ui-events/control-drag-end',
  MAIN_BLOCK_HIDE_TRIGGERED: 'ui-events/main-block-hide-triggered',
  MAIN_BLOCK_SHOW_TRIGGERED: 'ui-events/main-block-show-triggered',
  PROGRESS_SYNC_BUTTON_MOUSE_ENTER_TRIGGERED:
    'ui-events/progress-sync-button-mouse-enter-triggered',
  PROGRESS_SYNC_BUTTON_MOUSE_LEAVE_TRIGGERED:
    'ui-events/progress-sync-button-mouse-leave-triggered',
  RESIZE: 'ui-events/resize',
};

export default UI_EVENTS;
