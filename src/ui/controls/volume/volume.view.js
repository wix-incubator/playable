import $ from 'jbone';

import volumeFullSVG from './svg/volume-full.svg';
import volumeMidSVG from './svg/volume-mid.svg';
import volumeMinSVG from './svg/volume-min.svg';
import volumeMutedSVG from './svg/volume-muted.svg';

import styles from './volume.scss';

const MAX_VOLUME_ICON_RANGE = 60;
const MID_VOLUME_ICON_RANGE = 25;

export default class VolumeView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['volume-control']
    });

    this.$volumeIcon = $('<img>', {
      class: `${styles['volume-icon']} ${styles.icon}`,
      src: volumeFullSVG
    });

    this.$volumeMutedIcon = $('<img>', {
      class: `${styles['volume-icon']} ${styles.icon}`,
      src: volumeMutedSVG
    });

    const $innerWrapper = $('<div>', {
      class: styles['volume-inner-wrapper']
    });

    const $inputWrapper = $('<div>', {
      class: styles['volume-input-wrapper']
    });

    this.$volumeLevel = $('<progress>', {
      class: styles['volume-level'],
      role: 'played',
      max: 100,
      value: 0
    });

    this.$input = $('<input>', {
      class: styles['volume-input'],
      id: 'volume-input',
      type: 'range',
      min: 0,
      max: 100,
      step: 0.1,
      value: 0
    });

    $inputWrapper
      .append(this.$input)
      .append(this.$volumeLevel);

    $innerWrapper.append($inputWrapper);

    this.$node
      .append(this.$volumeIcon)
      .append(this.$volumeMutedIcon)
      .append($innerWrapper);

    this._bindEvents();
  }

  _onInputChange() {
    this._callbacks.onVolumeLevelChangeFromInput(this.$input.val());
  }

  _onWheel(e) {
    e.preventDefault();

    if (!e.deltaY) {
      return;
    }

    this._callbacks.onVolumeLevelChangeFromWheel(e.deltaY);
  }

  _onMuteClick() {
    this._callbacks.onMuteStatusChange();
  }

  _bindEvents() {
    this._onInputChange = this._onInputChange.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onMuteClick = this._onMuteClick.bind(this);

    this.$node
      .on('wheel', this._onWheel);

    this.$input
      .on('change', this._onInputChange)
      .on('input', this._onInputChange);

    this.$volumeIcon
      .on('click', this._onMuteClick);

    this.$volumeMutedIcon
      .on('click', this._onMuteClick);
  }

  _unbindEvents() {
    this.$node
      .off('wheel', this._onWheel);

    this.$input
      .off('change', this._onInputChange)
      .off('input', this._onInputChange);

    this.$volumeIcon
      .off('click', this._onMuteClick);

    this.$volumeMutedIcon
      .off('click', this._onMuteClick);
  }

  setVolumeLevel(level) {
    this.$input.val(level);
    this.$input.attr('value', level);
    this.$volumeLevel.attr('value', level);

    if (level >= MAX_VOLUME_ICON_RANGE) {
      this.$volumeIcon[0].src = volumeFullSVG;
    } else if (level >= MID_VOLUME_ICON_RANGE) {
      this.$volumeIcon[0].src = volumeMidSVG;
    } else {
      this.$volumeIcon[0].src = volumeMinSVG;
    }
  }

  setMuteStatus(isMuted) {
    this.$volumeIcon.toggleClass(styles.hidden, isMuted);
    this.$volumeMutedIcon.toggleClass(styles.hidden, !isMuted);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$input;
    delete this.$volumeIcon;
    delete this.$volumeMutedIcon;
    delete this.$volumeLevel;
    delete this.$node;

  }
}
