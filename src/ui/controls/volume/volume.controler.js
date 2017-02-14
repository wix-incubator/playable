import View from './volume.view';

import styles from './volume.scss';


export default class TimeControl {
  constructor({ onVolumeLevelChange, onMuteStatusChange }) {
    this.isMuted = false;
    this.volumeLevel = 100;

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
    this._getVolumeLevelFromInput = this._getVolumeLevelFromInput.bind(this);
    this._changeMuteStatus = this._changeMuteStatus.bind(this);
    this._getVolumeLevelFromWheel = this._getVolumeLevelFromWheel.bind(this);

    this.view.$node
      .on('wheel', this._getVolumeLevelFromWheel);

    this.view.$input
      .on('change', this._getVolumeLevelFromInput)
      .on('input', this._getVolumeLevelFromInput);

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

  _getVolumeLevelFromWheel(e) {
    e.preventDefault();

    if (!e.deltaY) {
      return;
    }

    const adjustedVolume = this.volumeLevel - e.deltaY / 10;
    const validatedVolume = Math.min(100, Math.max(0, adjustedVolume));

    this._callVolumeChangeCallbacks(validatedVolume);
  }

  _getVolumeLevelFromInput() {
    this._callVolumeChangeCallbacks(this.view.$input.val());
  }

  _callVolumeChangeCallbacks(level) {
    this._callbacks.onVolumeLevelChange(this._convertVolumeLevelToVideoVolume(level));
    if (this.isMuted) {
      this._callbacks.onMuteStatusChange(!this.isMuted);
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

    if (level > 50) {
      this.view.$volumeIcon[0].src = this.view.volumeFullSVG;
    }
    if (level < 50 && level > 10) {
      this.view.$volumeIcon[0].src = this.view.volumeMidSVG;
    }
    if (level < 10) {
      this.view.$volumeIcon[0].src = this.view.volumeMinSVG;
    }

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

  hide() {
    this.isHidden = true;
    this.view.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.isHidden = false;
    this.view.$node.toggleClass(styles.hidden, false);
  }
}
