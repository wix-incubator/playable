import { UI_EVENTS, EngineState } from '../../../constants';

import View from './interaction-indicator.view';

import { IEventEmitter } from '../../event-emitter/types';
import { IPlaybackEngine } from '../../playback-engine/types';
import { IInteractionIndicator } from './types';
import { IPlayerConfig } from '../../../core/config';
import { IRootContainer } from '../../root-container/types';

export default class InteractionIndicator implements IInteractionIndicator {
  static moduleName = 'interactionIndicator';
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'config', 'rootContainer'];

  private _eventEmitter: IEventEmitter;
  private _engine: IPlaybackEngine;

  private _unbindEvents: Function;

  view: View;

  constructor({
    eventEmitter,
    engine,
    config,
    rootContainer,
  }: {
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    config: IPlayerConfig;
    rootContainer: IRootContainer;
  }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;

    this._initUI();
    this._bindEvents();

    rootContainer.appendComponentElement(this.getElement());

    if (config.hideMainUI) {
      this.hide();
    }
  }

  getElement() {
    return this.view.getElement();
  }

  private _initUI() {
    this.view = new View();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [
          UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED,
          this._showPlaybackChangeIndicator,
        ],
        [UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED, this.showRewind],
        [UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED, this.showForward],
        [
          UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
          this.showIncreaseVolume,
        ],
        [
          UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
          this.showDecreaseVolume,
        ],
        [UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED, this.showMute],
        [
          UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
          this.showIncreaseVolume,
        ],
      ],
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
    this.view.show();
  }

  hide() {
    this.view.hide();
  }

  private _showPlaybackChangeIndicator() {
    const state = this._engine.getCurrentState();

    if (state === EngineState.PLAY_REQUESTED || state === EngineState.PLAYING) {
      this.view.activatePauseIcon();
    } else {
      this.view.activatePlayIcon();
    }
  }

  destroy() {
    this._unbindEvents();

    this.view.destroy();
    this.view = null;

    this._eventEmitter = null;
    this._engine = null;
  }
}
