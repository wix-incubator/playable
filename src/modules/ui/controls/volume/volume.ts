import View from './volume.view';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import { AMOUNT_TO_CHANGE_VOLUME } from '../../../keyboard-control/keyboard-control';
import { VIDEO_EVENTS, UI_EVENTS } from '../../../../constants';

import { IEventEmitter } from '../../../event-emitter/types';
import { ITooltipService } from '../../core/tooltip';
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

  private _isMuted: boolean;
  private _volume: number;

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

    this._isMuted = this._engine.getMute();
    this._volume = this._engine.getVolume();

    this._bindCallbacks();

    this._initUI();

    this._bindEvents();

    this.view.setVolume(this._volume);
    this.view.setMute(this._isMuted);

    this._initInterceptor();
  }

  get node() {
    return this.view.getNode();
  }

  private _initUI() {
    const config: IVolumeViewConfig = {
      callbacks: {
        onDragStart: this._broadcastDragStart,
        onDragEnd: this._broadcastDragEnd,
        onVolumeLevelChangeFromInput: this._getVolumeLevelFromInput,
        onVolumeLevelChangeFromWheel: this._getVolumeLevelFromWheel,
        onToggleMuteClick: this._toggleMuteStatus,
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
            this._isMuted
              ? UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED
              : UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
          );
        },
        [KEYCODES.ENTER]: e => {
          e.stopPropagation();

          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(
            this._isMuted
              ? UI_EVENTS.UNMUTE_SOUND_WITH_KEYBOARD_TRIGGERED
              : UI_EVENTS.MUTE_SOUND_WITH_KEYBOARD_TRIGGERED,
          );
        },
      },
    );

    this._inputInterceptor = new KeyboardInterceptor(this.view.getInputNode(), {
      [KEYCODES.RIGHT_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();

        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(
          UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
        );
        this._engine.setMute(false);
        this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
      },
      [KEYCODES.LEFT_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();

        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(
          UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
        );
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
      [[VIDEO_EVENTS.VOLUME_STATUS_CHANGED, this._updateVolumeStatus]],
      this,
    );
  }

  private _bindCallbacks() {
    this._getVolumeLevelFromInput = this._getVolumeLevelFromInput.bind(this);
    this._toggleMuteStatus = this._toggleMuteStatus.bind(this);
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
    this._eventEmitter.emit(UI_EVENTS.VOLUME_CHANGE_TRIGGERED, level);
  }

  private _toggleMuteStatus() {
    this._engine.setMute(!this._isMuted);
    this._eventEmitter.emit(UI_EVENTS.MUTE_STATUS_TRIGGERED, !this._isMuted);
  }

  private _getVolumeLevelFromWheel(delta: number) {
    const adjustedVolume = this._volume + delta / 10;
    const validatedVolume = Math.min(100, Math.max(0, adjustedVolume));

    this._changeVolumeStatus(validatedVolume);
  }

  private _getVolumeLevelFromInput(level: number) {
    this._changeVolumeStatus(level);
  }

  private _changeVolumeStatus(level: number) {
    this._changeVolumeLevel(level);
    if (this._isMuted) {
      this._toggleMuteStatus();
    }
  }

  private _updateVolumeStatus() {
    this.setVolumeLevel(this._engine.getVolume());
    this.setMuteStatus(this._engine.getMute());
  }

  setVolumeLevel(level: number) {
    if (level === this._volume) {
      return;
    }

    this._volume = level;

    this.view.setVolume(this._volume);
    this.view.setMute(Boolean(!this._volume));
  }

  setMuteStatus(isMuted: boolean) {
    if (isMuted === this._isMuted) {
      return;
    }

    this._isMuted = isMuted;

    this.view.setVolume(this._isMuted ? 0 : this._volume);
    this.view.setMute(this._isMuted || Boolean(!this._volume));
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
  }
}
