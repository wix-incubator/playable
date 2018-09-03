const UI_EVENTS = {
  PLAY_CLICK: 'ui-events/play-click',
  PLAY_OVERLAY_CLICK: 'ui-events/play-overlay-click',
  PAUSE_CLICK: 'ui-events/pause-click',

  PROGRESS_CHANGE: 'ui-events/progress-change',
  PROGRESS_DRAG_STARTED: 'ui-events/progress-drag-started',
  PROGRESS_DRAG_ENDED: 'ui-events/progress-drag-ended',
  PROGRESS_SYNC_BUTTON_MOUSE_ENTER:
    'ui-events/progress-sync-button-mouse-enter',
  PROGRESS_SYNC_BUTTON_MOUSE_LEAVE:
    'ui-events/progress-sync-button-mouse-leave',
  PROGRESS_USER_PREVIEWING_FRAME: 'ui-events/progress-user-previewing-frame',

  VOLUME_CHANGE: 'ui-events/volume-change',
  MUTE_CLICK: 'ui-events/mute-click',
  UNMUTE_CLICK: 'ui-events/unmute-click',

  ENTER_FULL_SCREEN_CLICK: 'ui-events/enter-full-screen-click',
  EXIT_FULL_SCREEN_CLICK: 'ui-events/enter-full-screen-click',

  // TODO: follow ENTITY_EVENT or ENTITY_EVENT format
  MOUSE_ENTER_ON_PLAYER: 'ui-events/mouse-enter-on-player',
  MOUSE_MOVE_ON_PLAYER: 'ui-events/mouse-move-on-player',
  MOUSE_LEAVE_ON_PLAYER: 'ui-events/mouse-leave-on-player',

  MAIN_BLOCK_HIDE: 'ui-events/main-block-hide',
  MAIN_BLOCK_SHOW: 'ui-events/main-block-show',

  LOADER_SHOW: 'ui-events/loader-show',
  LOADER_HIDE: 'ui-events/loader-hide',

  LOADING_COVER_SHOW: 'ui-events/loading-cover-show',
  LOADING_COVER_HIDE: 'ui-events/loading-cover-hide',

  TOGGLE_PLAYBACK_WITH_KEYBOARD: 'ui-events/toggle-playback-with-keyboard',
  GO_BACKWARD_WITH_KEYBOARD: 'ui-events/go-backward-with-keyboard',
  GO_FORWARD_WITH_KEYBOARD: 'ui-events/go-forward-with-keyboard',
  INCREASE_VOLUME_WITH_KEYBOARD: 'ui-events/increase-volume-with-keyboard',
  DECREASE_VOLUME_WITH_KEYBOARD: 'ui-events/decrease-volume-with-keyboard',
  MUTE_WITH_KEYBOARD: 'ui-events/mute-with-keyboard',
  UNMUTE_WITH_KEYBOARD: 'ui-events/unmute-with-keyboard',
  HIDE_INTERACTION_INDICATOR: 'ui-events/hide-interaction-indicator',

  PLAY_WITH_SCREEN_CLICK: 'ui-events/play-with-screen-click',
  PAUSE_WITH_SCREEN_CLICK: 'ui-events/pause-with-screen-click',
  ENTER_FULL_SCREEN_WITH_SCREEN_CLICK:
    'ui-events/enter-full-screen-with-screen-click',
  EXIT_FULL_SCREEN_WITH_SCREEN_CLICK:
    'ui-events/exit-full-screen-with-screen-click',

  CONTROL_DRAG_START: 'ui-events/control-drag-start',
  CONTROL_DRAG_END: 'ui-events/control-drag-end',

  KEYBOARD_KEYDOWN_INTERCEPTED: 'ui-events/keyboard-keydown-intercepted',
  FULL_SCREEN_STATE_CHANGED: 'ui-events/full-screen-state-changed',
  RESIZE: 'ui-events/resize',
};

export default UI_EVENTS;
