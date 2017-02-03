import $ from 'jbone';

import styles from '../scss/index.scss';


export default class ProgressControl {
  constructor({ onProgressChange }) {
    this._isUserInteracting = false;
    this.currentProgress = 0;


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
      .append(this.$played)
      .append(this.$buffered);
  }

  _initEvents() {
    this._changePlayedProgress = this._changePlayedProgress.bind(this);
    this._toggleUserInteractingStatus = this._toggleUserInteractingStatus.bind(this);

    this.$input
      .on('input', this._changePlayedProgress)
      .on('change', this._changePlayedProgress)
      .on('mousedown', this._toggleUserInteractingStatus)
      .on('mouseup', this._toggleUserInteractingStatus);
  }

  _changePlayedProgress(e) {
    if (this.currentProgress !== this.$input.val()) {
      this.currentProgress = this.$input.val();
      this._callbacks.onProgressChange(this.currentProgress / this.$input.attr('max'));
      this.$played.attr('value', this.currentProgress);
    }
  }

  _toggleUserInteractingStatus() {
    this._isUserInteracting = !this._isUserInteracting;
  }

  updatePlayed(percent) {
    if (!this._isUserInteracting) {
      this.currentProgress = percent;
      this.$input.val(this.currentProgress);
      this.$input.attr('value', this.currentProgress);
      this.$played.attr('value', this.currentProgress);
    }
  }

  updateBuffered(percent) {
    this.$buffered.attr('value', percent);
  }
}
