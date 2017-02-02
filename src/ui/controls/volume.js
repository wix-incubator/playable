import $ from 'jbone';

import styles from '../scss/index.scss';

import volumeSVG from '../../static/svg/controls/volume.svg';
import volumeMutedSVG from '../../static/svg/controls/volume-muted.svg';


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
    return this.$node;
  }

  _initUI() {
    this.$node = $('<div>', {
      class: styles['volume-control']
    });

    this.$volumeIcon = $('<img>', {
      class: `${styles['volume-icon']} ${styles.icon}`,
      src: volumeSVG
    });

    this.$volumeMutedIcon = $('<img>', {
      class: `${styles['volume-icon']}`,
      src: volumeMutedSVG
    });

    this.$innerWrapper = $('<div>', {
      class: styles['volume-inner-wrapper']
    });

    this.$inputWrapper = $('<div>', {
      class: styles['volume-input-wrapper']
    });

    this.$volumeLevel = $('<progress>', {
      class: styles['volume-level'],
      role: 'played',
      max: 100,
      value: 0
    });


    this.$input = $('<input>', {
      class: styles['seek-input'],
      id: 'seek-input',
      type: 'range',
      min: 0,
      max: 100,
      step: 0.1,
      value: 0
    });

    this.$inputWrapper
      .append(this.$volumeLevel)
      .append(this.$input);

    this.$innerWrapper.append(this.$inputWrapper);
    this.$node
      .append(this.$volumeIcon)
      .append(this.$volumeMutedIcon)
      .append(this.$innerWrapper);
  }

  _initEvents() {
    this._changeVolumeLevel = this._changeVolumeLevel.bind(this);
    this._changeMuteStatus = this._changeMuteStatus.bind(this);

    this.$input
      .on('input', this._changeVolumeLevel);

    this.$volumeIcon
      .on('click', this._changeMuteStatus);

    this.$volumeMutedIcon
      .on('click', this._changeMuteStatus);
  }

  _convertVolumeLevelToVideoVolume(level) {
    return level / 100;
  }

  _convertVideoVolumeToVolumeLevel(level) {
    return level * 100;
  }

  _changeVolumeLevel() {
    this.volumeLevel = this.$input.val();
    this._callbacks.onVolumeLevelChange(this._convertVolumeLevelToVideoVolume(this.volumeLevel));
    this.$volumeLevel.attr('value', this.volumeLevel);
  }

  _changeMuteStatus() {
    this.isMuted = !this.isMuted;
    this._callbacks.onMuteStatusChange(this.isMuted);
    this._setMuteInputState(this.isMuted);
    if (!this.isMuted) {
      this._setVolumeInputState(this.volumeLevel);
    } else {
      this._setVolumeInputState(0);
    }
  }

  setVolumeLevel(level) {
    this.volumeLevel = this._convertVideoVolumeToVolumeLevel(level);
    this._setVolumeInputState(this.volumeLevel);
  }

  _setVolumeInputState(level) {
    this.$input.val(level);
    this.$input.attr('value', level);
    this.$volumeLevel.attr('value', level);
  }

  _setMuteInputState(isMuted) {
    if (isMuted) {
      this.$volumeIcon.addClass(styles['hidden']);
      this.$volumeMutedIcon.removeClass(styles['hidden']);
    } else {
      this.$volumeMutedIcon.addClass(styles['hidden']);
      this.$volumeIcon.removeClass(styles['hidden']);
    }
  }

  setMuteStatus(isMuted) {
    this.isMuted = isMuted;
    this._setMuteInputState(isMuted);
    if (!this.isMuted) {
      this._setVolumeInputState(this.volumeLevel);
    } else {
      this._setVolumeInputState(0);
    }
  }
}
