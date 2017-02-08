import View from './volume.view';

import styles from './volume.scss';


export default class TimeControl {
  constructor({ onVolumeLevelChange, onMuteStatusChange }) {
    this.isMuted = false;
    this.volumeLevel = 1;

    this._callbacks = {
      onVolumeLevelChange,
      onMuteStatusChange
    };

    this._initUI();
    this._initEvents();

    this._setVolumeInputState(this.volumeLevel);
    this._setMuteInputState(this.isMuted);
  }

  get node() {
    return this.view.$node;
  }

  _initUI() {
    this.view = new View();
  }

  _initEvents() {
    this._changeVolumeLevel = this._changeVolumeLevel.bind(this);
    this._changeMuteStatus = this._changeMuteStatus.bind(this);

    this.view.$input
      .on('change', this._changeVolumeLevel)
      .on('input', this._changeVolumeLevel);

    this.view.$volumeIcon
      .on('click', this._changeMuteStatus);

    this.view.$volumeMutedIcon
      .on('click', this._changeMuteStatus);
  }

  _convertVolumeLevelToVideoVolume(level) {
    return level / 100;
  }

  _convertVideoVolumeToVolumeLevel(level) {
    return level * 100;
  }

  _changeVolumeLevel() {
    if (this.volumeLevel !== this.view.$input.val()) {
      this.volumeLevel = this.view.$input.val();
      this._callbacks.onVolumeLevelChange(this._convertVolumeLevelToVideoVolume(this.volumeLevel));
      this.view.$volumeLevel.attr('value', this.volumeLevel);
      if (this.isMuted) {
        this._callbacks.onMuteStatusChange(!this.isMuted);
      }
    }
  }

  _changeMuteStatus() {
    this._callbacks.onMuteStatusChange(!this.isMuted);
  }

  setVolumeLevel(level) {
    this.volumeLevel = this._convertVideoVolumeToVolumeLevel(level);
    this._setVolumeInputState(this.volumeLevel);
  }

  _setVolumeInputState(level) {
    this.view.$input.val(level);
    this.view.$input.attr('value', level);
    this.view.$volumeLevel.attr('value', level);
    if (!level) {
      this._callbacks.onMuteStatusChange(true);
    }
  }

  _setMuteInputState(isMuted) {
    this.view.$volumeIcon.toggleClass(styles.hidden, isMuted);
    this.view.$volumeMutedIcon.toggleClass(styles.hidden, !isMuted);
  }

  setMuteStatus(isMuted) {
    this.isMuted = isMuted;
    this._setMuteInputState(isMuted);
    if (this.isMuted) {
      this._setVolumeInputState(0);
    } else {
      this._setVolumeInputState(this.volumeLevel);
    }
  }
}
