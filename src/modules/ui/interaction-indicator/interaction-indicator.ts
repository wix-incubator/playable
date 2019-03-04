import { UIEvent, EngineState } from '../../../constants';

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

  private _unbindEvents: () => void;

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
          UIEvent.TOGGLE_PLAYBACK_WITH_KEYBOARD,
          this._showPlaybackChangeIndicator,
        ],
        [UIEvent.GO_BACKWARD_WITH_KEYBOARD, this.showRewind],
        [UIEvent.GO_FORWARD_WITH_KEYBOARD, this.showForward],
        [UIEvent.INCREASE_VOLUME_WITH_KEYBOARD, this.showIncreaseVolume],
        [UIEvent.DECREASE_VOLUME_WITH_KEYBOARD, this.showDecreaseVolume],
        [UIEvent.MUTE_WITH_KEYBOARD, this.showMute],
        [UIEvent.UNMUTE_WITH_KEYBOARD, this.showIncreaseVolume],
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
    this._eventEmitter.emitAsync(UIEvent.HIDE_INTERACTION_INDICATOR);
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
  }
}
