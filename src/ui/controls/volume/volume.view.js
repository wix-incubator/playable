import $ from 'jbone';

import styles from './volume.scss';


const MAX_VOLUME_ICON_RANGE = 30;

export default class VolumeView {
  static _styles = styles;

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
  }

  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['volume-control']
    });

    this.$muteControl = $('<div>', {
      class: `${this.styleNames['mute-button']} ${this.styleNames.icon}`,
      'data-hook': 'mute-button'
    });

    this.$container = $('<div>', {
      class: this.styleNames.container
    });

    const $content = $('<div>', {
      class: this.styleNames.content
    });

    const $inputWrapper = $('<div>', {
      class: this.styleNames['input-wrapper']
    });

    this.$filledProgress = $('<div>', {
      class: this.styleNames['filled-progress']
    });

    this.$input = $('<input>', {
      class: `${this.styleNames['volume-input']}`,
      'data-hook': 'volume-input',
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

  _preventClickPropagation(event) {
    event.stopPropagation();
  }

  _bindEvents() {
    this._onInputChange = this._onInputChange.bind(this);
    this._onWheel = this._onWheel.bind(this);

    this.$node[0]
      .addEventListener('wheel', this._onWheel);

    this.$container[0]
      .addEventListener('click', this._preventClickPropagation);

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
      .removeEventListener('click', this._preventClickPropagation);

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
      this.$muteControl.toggleClass(this.styleNames['half-volume'], false);
    } else {
      this.$muteControl.toggleClass(this.styleNames['half-volume'], true);
    }
  }

  _setMuteStatus(isMuted) {
    this.$muteControl.toggleClass(this.styleNames.muted, isMuted);
  }

  get styleNames() {
    return this.constructor._styles;
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
