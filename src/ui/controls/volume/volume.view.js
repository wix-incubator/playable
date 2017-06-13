import $ from 'jbone';

import styles from './volume.scss';


const MAX_VOLUME_ICON_RANGE = 50;

export default class VolumeView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['volume-control']
    });

    this.$muteControl = $('<div>', {
      class: `${styles['mute-button']} ${styles.icon}`
    });

    this.$container = $('<div>', {
      class: styles.container
    });

    const $content = $('<div>', {
      class: styles.content
    });

    const $inputWrapper = $('<div>', {
      class: styles['input-wrapper']
    });

    this.$filledProgress = $('<div>', {
      class: styles['filled-progress']
    });

    this.$input = $('<input>', {
      class: `${styles['volume-input']}`,
      id: 'volume-input',
      orient: 'vertical',
      type: 'range',
      min: 0,
      max: 100,
      step: 0.1,
      value: 0
    });

    $inputWrapper
      .append(this.$filledProgress)
      .append(this.$input);

    $content.append($inputWrapper);
    this.$container.append($content);

    this.$node
      .append(this.$muteControl)
      .append(this.$container);

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

  _stopPropagationForContainer(event) {
    event.stopPropagation();
  }

  _bindEvents() {
    this._onInputChange = this._onInputChange.bind(this);
    this._onWheel = this._onWheel.bind(this);

    this.$node[0]
      .addEventListener('wheel', this._onWheel);

    this.$container[0]
      .addEventListener('click', this._stopPropagationForContainer);

    this.$input[0]
      .addEventListener('change', this._onInputChange);

    this.$input[0]
      .addEventListener('input', this._onInputChange);

    this.$muteControl[0]
      .addEventListener('click', this._callbacks.onToggleMuteClick);
  }

  _unbindEvents() {
    this.$node[0]
      .removeEventListener('wheel', this._onWheel);

    this.$container[0]
      .removeEventListener('click', this._stopPropagationForContainer);

    this.$input[0]
      .removeEventListener('change', this._onInputChange);

    this.$input[0]
      .removeEventListener('input', this._onInputChange);

    this.$muteControl[0]
      .removeEventListener('click', this._callbacks.onToggleMuteClick);
  }

  setState({ volume, isMuted }) {
    (volume !== undefined) && this._setVolumeLevel(volume);
    (isMuted !== undefined) && this._setMuteStatus(isMuted);
  }

  _setVolumeLevel(volume) {
    this.$input.val(volume);
    this.$input.attr('value', volume);
    this.$filledProgress.attr('style', `height:${volume}%;`);

    if (volume >= MAX_VOLUME_ICON_RANGE) {
      this.$muteControl.toggleClass(styles['half-volume'], false);
    } else {
      this.$muteControl.toggleClass(styles['half-volume'], true);
    }
  }

  _setMuteStatus(isMuted) {
    this.$muteControl.toggleClass(styles.muted, isMuted);
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
    delete this.$muteControl;
    delete this.$filledProgress;
    delete this.$container;
    delete this.$node;

  }
}
