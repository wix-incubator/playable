import View from './volume.view';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import { AMOUNT_TO_CHANGE_VOLUME } from '../../../keyboard-control/keyboard-control';
import { VIDEO_EVENTS, UI_EVENTS } from '../../../../constants';

import { IEventEmitter } from '../../../event-emitter/types';
import { ITooltipService } from '../../core/tooltip/types';
import { IVolumeControl, IVolumeViewConfig } from './types';
import { ITextMap } from '../../../text-map/types';
import { IPlaybackEngine } from '../../../playback-engine/types';
import { IThemeService } from '../../core/theme';

export default class VolumeControl implements IVolumeControl {
  static moduleName = 'volumeControl';
  static View = View;
  static dependencies = [
    'engine',
    'eventEmitter',
    'textMap',
    'tooltipService',
    'theme',
  ];

  private _engine: IPlaybackEngine;
  private _eventEmitter: IEventEmitter;
  private _textMap: ITextMap;
  private _tooltipService: ITooltipService;
  private _theme: IThemeService;

  private _buttonInterceptor: KeyboardInterceptor;
  private _inputInterceptor: KeyboardInterceptor;

  private _unbindEvents: Function;

  view: View;
  isHidden: boolean;

  constructor({
    engine,
    eventEmitter,
    textMap,
    tooltipService,
    theme,
  }: {
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    textMap: ITextMap;
    tooltipService: ITooltipService;
    theme: IThemeService;
  }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._tooltipService = tooltipService;
    this._theme = theme;

    this._bindCallbacks();

    this._initUI();

    this._bindEvents();

    this.view.setVolume(this._engine.getVolume());
    this.view.setMute(this._engine.isMuted);

    this._initInterceptor();
  }

  getElement() {
    return this.view.getElement();
  }

  private _initUI() {
    const config: IVolumeViewConfig = {
      callbacks: {
        onDragStart: this._broadcastDragStart,
        onDragEnd: this._broadcastDragEnd,
        onVolumeLevelChangeFromInput: this._getVolumeLevelFromInput,
        onVolumeLevelChangeFromWheel: this._getVolumeLevelFromWheel,
        onToggleMuteClick: this._toggleMuteState,
      },
      theme: this._theme,
      textMap: this._textMap,
      tooltipService: this._tooltipService,
    };

    this.view = new VolumeControl.View(config);
  }

  private _initInterceptor() {
    this._buttonInterceptor = new KeyboardInterceptor(
      this.view.getButtonNode(),
      {
        [KEYCODES.SPACE_BAR]: e => {
          e.stopPropagation();

          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(
            this._engine.isMuted
              ? UI_EVENTS.UNMUTE_WITH_KEYBOARD
              : UI_EVENTS.MUTE_WITH_KEYBOARD,
          );
        },
        [KEYCODES.ENTER]: e => {
          e.stopPropagation();

          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(
            this._engine.isMuted
              ? UI_EVENTS.UNMUTE_WITH_KEYBOARD
              : UI_EVENTS.MUTE_WITH_KEYBOARD,
          );
        },
      },
    );

    this._inputInterceptor = new KeyboardInterceptor(this.view.getInputNode(), {
      [KEYCODES.RIGHT_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();

        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD);
        this._engine.setMute(false);
        this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
      },
      [KEYCODES.LEFT_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();

        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD);
        this._engine.setMute(false);
        this._engine.decreaseVolume(AMOUNT_TO_CHANGE_VOLUME);
      },
    });
  }

  private _destroyInterceptor() {
    this._buttonInterceptor.destroy();
    this._inputInterceptor.destroy();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [[VIDEO_EVENTS.SOUND_STATE_CHANGED, this._updateSoundState]],
      this,
    );
  }

  private _bindCallbacks() {
    this._getVolumeLevelFromInput = this._getVolumeLevelFromInput.bind(this);
    this._toggleMuteState = this._toggleMuteState.bind(this);
    this._getVolumeLevelFromWheel = this._getVolumeLevelFromWheel.bind(this);
    this._broadcastDragStart = this._broadcastDragStart.bind(this);
    this._broadcastDragEnd = this._broadcastDragEnd.bind(this);
  }

  private _broadcastDragStart() {
    this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_START);
  }

  private _broadcastDragEnd() {
    this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_END);
  }

  private _changeVolumeLevel(level: number) {
    this._engine.setVolume(level);
    this._eventEmitter.emit(UI_EVENTS.VOLUME_CHANGE, level);

    if (this._engine.isMuted) {
      this._toggleMuteState();
    }
  }

  private _toggleMuteState() {
    const desiredMuteState = !this._engine.isMuted;
    this._engine.setMute(desiredMuteState);
    this._eventEmitter.emit(
      desiredMuteState ? UI_EVENTS.MUTE_CLICK : UI_EVENTS.UNMUTE_CLICK,
    );
  }

  private _getVolumeLevelFromWheel(delta: number) {
    const adjustedVolume = this._engine.getVolume() + delta / 10;
    const validatedVolume = Math.min(100, Math.max(0, adjustedVolume));

    this._changeVolumeLevel(validatedVolume);
  }

  private _getVolumeLevelFromInput(level: number) {
    this._changeVolumeLevel(level);
  }

  private _updateSoundState() {
    this._setVolumeLevel(this._engine.getVolume());
    this._setMuteState(this._engine.isMuted);
  }

  private _setVolumeLevel(level: number) {
    this.view.setVolume(level);
    this.view.setMute(Boolean(!level));
  }

  private _setMuteState(isMuted: boolean) {
    const volume = this._engine.getVolume();

    this.view.setVolume(isMuted ? 0 : volume);
    this.view.setMute(isMuted || Boolean(!volume));
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  destroy() {
    this._destroyInterceptor();
    this._unbindEvents();
    this.view.destroy();
    this.view = null;

    this._eventEmitter = null;
    this._engine = null;
    this._textMap = null;
    this._theme = null;
  }
}
