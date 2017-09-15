import { UI_EVENTS, STATES } from '../../../constants/index';

import View from './manipulation-indicator.view';


export default class ManipulationIndicator {
  static View = View;
  static dependencies = ['engine', 'eventEmitter'];

  constructor({ eventEmitter, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this._initUI();
    this._bindEvents();
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    this.view = new View();
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.PAUSE_WITH_SCREEN_CLICK_TRIGGERED, this.view.activatePauseIcon, this.view);
    this._eventEmitter.on(UI_EVENTS.PLAY_WITH_SCREEN_CLICK_TRIGGERED, this.view.activatePlayIcon, this.view);
    this._eventEmitter.on(UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED, this._showPlaybackChangeIndicator, this);
    this._eventEmitter.on(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED, this.view.activateRewindIcon, this.view);
    this._eventEmitter.on(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED, this.view.activateForwardIcon, this.view);
    this._eventEmitter.on(
      UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
      this.view.activateIncreaseVolumeIcon,
      this.view
    );
    this._eventEmitter.on(
      UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
      this.view.activateDecreaseVolumeIcon,
      this.view
    );
    this._eventEmitter.on(
      UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
      this.view.activateMuteVolumeIcon,
      this.view
    );
    this._eventEmitter.on(
      UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
      this.view.activateIncreaseVolumeIcon,
      this.view
    );
    this._eventEmitter.on(UI_EVENTS.HIDE_MANIPULATION_INDICATOR_TRIGGERED, this.view.deactivateIcon, this.view);
  }

  _unbindEvents() {
    this._eventEmitter.off(UI_EVENTS.PAUSE_WITH_SCREEN_CLICK_TRIGGERED, this.view.activatePauseIcon, this.view);
    this._eventEmitter.off(UI_EVENTS.PLAY_WITH_SCREEN_CLICK_TRIGGERED, this.view.activatePlayIcon, this.view);
    this._eventEmitter.off(UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED, this._showPlaybackChangeIndicator, this);
    this._eventEmitter.off(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED, this.view.activateRewindIcon, this.view);
    this._eventEmitter.off(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED, this.view.activateForwardIcon, this.view);
    this._eventEmitter.off(
      UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
      this.view.activateIncreaseVolumeIcon,
      this.view
    );
    this._eventEmitter.off(
      UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
      this.view.activateDecreaseVolumeIcon,
      this.view
    );
    this._eventEmitter.off(
      UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
      this.view.activateMuteVolumeIcon,
      this.view
    );
    this._eventEmitter.off(
      UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
      this.view.activateIncreaseVolumeIcon,
      this.view
    );
    this._eventEmitter.off(UI_EVENTS.HIDE_MANIPULATION_INDICATOR_TRIGGERED, this.view.deactivateIcon, this.view);
  }

  _showPlaybackChangeIndicator() {
    const state = this._engine.getCurrentState();

    if (
      state === STATES.PLAY_REQUESTED ||
      state === STATES.PLAYING
    ) {
      this.view.activatePauseIcon();
    } else {
      this.view.activatePlayIcon();
    }
  }

  destroy() {
    this._unbindEvents();

    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
  }
}
