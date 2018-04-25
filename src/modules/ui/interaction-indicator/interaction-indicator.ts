import { UI_EVENTS, STATES } from '../../../constants';

import View from './interaction-indicator.view';

export default class InteractionIndicator {
  static moduleName = 'interactionIndicator';
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config', 'rootContainer'];

  private _eventEmitter;
  private _engine;

  view: View;

  constructor({ eventEmitter, engine, config, rootContainer }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this._initUI();
    this._bindEvents();

    rootContainer.appendComponentNode(this.node);

    if (config.showInteractionIndicator === false) {
      this.hide();
    }
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    this.view = new View();
  }

  _bindEvents() {
    this._eventEmitter.on(
      UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED,
      this._showPlaybackChangeIndicator,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
      this.showRewind,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED,
      this.showForward,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
      this.showIncreaseVolume,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
      this.showDecreaseVolume,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
      this.showMute,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
      this.showIncreaseVolume,
      this,
    );
  }

  showPause() {
    this.view.activatePauseIcon();
  }

  showPlay() {
    this.view.activatePlayIcon();
  }

  showRewind() {
    this.view.activateRewindIcon();
  }

  showForward() {
    this.view.activateForwardIcon();
  }

  showMute() {
    this.view.activateMuteVolumeIcon();
  }

  showIncreaseVolume() {
    this.view.activateIncreaseVolumeIcon();
  }

  showDecreaseVolume() {
    this.view.activateDecreaseVolumeIcon();
  }

  hideIcons() {
    this.view.deactivateIcon();
    this._eventEmitter.emit(UI_EVENTS.HIDE_INTERACTION_INDICATOR_TRIGGERED);
  }

  show() {
    this.view.hide();
  }

  hide() {
    this.view.show();
  }

  _unbindEvents() {
    this._eventEmitter.off(
      UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED,
      this._showPlaybackChangeIndicator,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
      this.showRewind,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED,
      this.showForward,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
      this.showIncreaseVolume,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
      this.showDecreaseVolume,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
      this.showMute,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
      this.showIncreaseVolume,
      this,
    );
  }

  _showPlaybackChangeIndicator() {
    const state = this._engine.getCurrentState();

    if (state === STATES.PLAY_REQUESTED || state === STATES.PLAYING) {
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
