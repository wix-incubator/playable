import $ from 'jbone';

import styles from '../scss/index.scss';


export default class ProgressControl {
  _isUserInteracting = false;

  constructor({ onProgressChange }) {
    this._callbacks = {
      onProgressChange
    };

    this._initUI();
    this._initEvents();
  }

  get node() {
    return this.$node;
  }

  _initUI() {
    this.$node = $('<span>', {
      class: styles['progress-bar']
    });

    this.$played = $('<progress>', {
      class: styles['progress-played'],
      role: 'played',
      max: 100,
      value: 0
    });

    this.$buffered = $('<progress>', {
      class: styles['progress-buffered'],
      role: 'buffered',
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

    this.$node
      .append(this.$input)
      .append(this.$buffered)
      .append(this.$played);
  }

  _initEvents() {
    this._changePlayedProgress = this._changePlayedProgress.bind(this);
    this._toggleUserInteractingStatus = this._toggleUserInteractingStatus.bind(this);

    this.$input
      .on('input', this._changePlayedProgress)
      .on('mousedown', this._toggleUserInteractingStatus)
      .on('mouseup', this._toggleUserInteractingStatus);
  }

  _changePlayedProgress() {
    this._callbacks.onProgressChange(this.$input.val() / this.$input.attr('max'));
    this.$played.attr('value', this.$input.val());
  }

  _toggleUserInteractingStatus() {
    this._isUserInteracting = !this._isUserInteracting;
  }

  updatePlayed(percent) {
    if (!this._isUserInteracting) {
      this.$input.val(percent);
      this.$input.attr('value', percent);
      this.$played.attr('value', percent);
    }
  }

  updateBuffered(percent) {
    this.$buffered.attr('value', percent);
  }
}
