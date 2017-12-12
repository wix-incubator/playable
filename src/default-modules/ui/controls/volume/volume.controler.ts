import View from './volume.view';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import { AMOUNT_TO_CHANGE_VOLUME } from '../../../keyboard-control/keyboard-control';
import { VIDEO_EVENTS, UI_EVENTS } from '../../../../constants/index';

export default class VolumeControl {
  static View = View;
  static dependencies = ['engine', 'eventEmitter', 'textMap'];

  private _engine;
  private _eventEmitter;
  private _textMap;

  private _isMuted: boolean;
  private _volume: number;

  private _buttonInterceptor;
  private _inputInterceptor;

  view: View;
  isHidden: boolean;

  constructor({ engine, eventEmitter, textMap }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;

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

  _initUI() {
    const config = {
      callbacks: {
        onDragStart: this._broadcastDragStart,
        onDragEnd: this._broadcastDragEnd,
        onVolumeLevelChangeFromInput: this._getVolumeLevelFromInput,
        onVolumeLevelChangeFromWheel: this._getVolumeLevelFromWheel,
        onToggleMuteClick: this._toggleMuteStatus,
      },
      texts: this._textMap,
    };

    this.view = new VolumeControl.View(config);
  }

  _initInterceptor() {
    this._buttonInterceptor = new KeyboardInterceptor({
      node: this.view.getButtonNode(),
      callbacks: {
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
    });

    this._inputInterceptor = new KeyboardInterceptor({
      node: this.view.getInputNode(),
      callbacks: {
        [KEYCODES.RIGHT_ARROW]: e => {
          e.stopPropagation();
          e.preventDefault();

          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(
            UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
          );

          this._engine.increaseVolume(AMOUNT_TO_CHANGE_VOLUME);
        },
        [KEYCODES.LEFT_ARROW]: e => {
          e.stopPropagation();
          e.preventDefault();

          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
          this._eventEmitter.emit(
            UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
          );

          this._engine.decreaseVolume(AMOUNT_TO_CHANGE_VOLUME);
        },
      },
    });
  }

  _destroyInterceptor() {
    this._buttonInterceptor.destroy();
    this._inputInterceptor.destroy();
  }

  _bindEvents() {
    this._eventEmitter.on(
      VIDEO_EVENTS.VOLUME_STATUS_CHANGED,
      this._updateVolumeStatus,
      this,
    );
  }

  _bindCallbacks() {
    this._getVolumeLevelFromInput = this._getVolumeLevelFromInput.bind(this);
    this._toggleMuteStatus = this._toggleMuteStatus.bind(this);
    this._getVolumeLevelFromWheel = this._getVolumeLevelFromWheel.bind(this);
    this._broadcastDragStart = this._broadcastDragStart.bind(this);
    this._broadcastDragEnd = this._broadcastDragEnd.bind(this);
  }

  _broadcastDragStart() {
    this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_START);
  }

  _broadcastDragEnd() {
    this._eventEmitter.emit(UI_EVENTS.CONTORL_DRAG_END);
  }

  _changeVolumeLevel(level) {
    this._engine.setVolume(level);
    this._eventEmitter.emit(UI_EVENTS.VOLUME_CHANGE_TRIGGERED, level);
  }

  _toggleMuteStatus() {
    this._engine.setMute(!this._isMuted);
    this._eventEmitter.emit(UI_EVENTS.MUTE_STATUS_TRIGGERED, !this._isMuted);
  }

  _getVolumeLevelFromWheel(delta) {
    const adjustedVolume = this._volume + delta / 10;
    const validatedVolume = Math.min(100, Math.max(0, adjustedVolume));

    this._changeVolumeStatus(validatedVolume);
  }

  _getVolumeLevelFromInput(level) {
    this._changeVolumeStatus(level);
  }

  _changeVolumeStatus(level) {
    this._changeVolumeLevel(level);
    if (this._isMuted) {
      this._toggleMuteStatus();
    }
  }

  _updateVolumeStatus() {
    this.setVolumeLevel(this._engine.getVolume());
    this.setMuteStatus(this._engine.getMute());
  }

  setVolumeLevel(level) {
    if (level === this._volume) {
      return;
    }

    this._volume = level;

    this.view.setVolume(this._volume);
    this.view.setMute(Boolean(!this._volume));
  }

  setMuteStatus(isMuted) {
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

  _unbindEvents() {
    this._eventEmitter.off(
      VIDEO_EVENTS.VOLUME_STATUS_CHANGED,
      this._updateVolumeStatus,
      this,
    );
  }

  destroy() {
    this._destroyInterceptor();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this._textMap;

    this.isHidden = null;
    this._isMuted = null;
    this._volume = null;
  }
}
