import View from './volume.view';

import { VIDEO_EVENTS, UI_EVENTS } from '../../../../constants/index';


export default class VolumeControl {
  static View = View;
  static dependencies = ['engine', 'eventEmitter'];

  constructor({ engine, eventEmitter }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;

    this._isMuted = this._engine.getMute();
    this._volumeLevel = this._engine.getVolume();

    this._bindCallbacks();

    this._initUI();

    this._bindEvents();

    this.view.setState({
      volume: this._volumeLevel,
      isMuted: this._isMuted
    });
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    const config = {
      callbacks: {
        onVolumeLevelChangeFromInput: this._getVolumeLevelFromInput,
        onVolumeLevelChangeFromWheel: this._getVolumeLevelFromWheel,
        onToggleMuteClick: this._toggleMuteStatus
      }
    };

    this.view = new this.constructor.View(config);
  }

  _bindEvents() {
    this._eventEmitter.on(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, this._updateVolumeStatus, this);
  }

  _bindCallbacks() {
    this._getVolumeLevelFromInput = this._getVolumeLevelFromInput.bind(this);
    this._toggleMuteStatus = this._toggleMuteStatus.bind(this);
    this._getVolumeLevelFromWheel = this._getVolumeLevelFromWheel.bind(this);
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
    const adjustedVolume = this._volumeLevel + delta / 10;
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
    if (level === this._volumeLevel) {
      return;
    }

    this._volumeLevel = level;

    this.view.setState({
      volume: this._volumeLevel,
      isMuted: !this._volumeLevel
    });
  }

  setMuteStatus(isMuted) {
    if (isMuted === this._isMuted) {
      return;
    }

    this._isMuted = isMuted;

    this.view.setState({
      volume: this._isMuted ? 0 : this._volumeLevel,
      isMuted: this._isMuted || !this._volumeLevel
    });
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
    this._eventEmitter.off(VIDEO_EVENTS.VOLUME_STATUS_CHANGED, this._updateVolumeStatus, this);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;

    this.isHidden = null;
    this._isMuted = null;
    this._volumeLevel = null;
  }
}
