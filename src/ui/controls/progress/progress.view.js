import $ from 'jbone';

import styles from './progress.scss';


export default class ProgressView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['progress-bar']
    });

    this.$played = $('<progress>', {
      class: styles['progress-played'],
      'data-hook': 'played-indicator',
      role: 'played',
      max: 100,
      value: 0
    });

    this.$buffered = $('<progress>', {
      class: styles['progress-buffered'],
      'data-hook': 'buffered-indicator',
      role: 'buffered',
      max: 100,
      value: 0
    });

    this.$input = $('<input>', {
      class: styles['seek-control'],
      'data-hook': 'seek-input',
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

    this._bindEvents();
  }

  _onMouseInteractionStart(e) {
    if (e.buttons > 1) {
      return;
    }

    this._callbacks.onUserInteractionStart();
  }

  _onMouseInteractionEnd(e) {
    if (e.buttons > 1) {
      return;
    }

    this._callbacks.onUserInteractionEnd();
  }

  _onInputValueChange() {
    const value = this.$input.val();
    this.$played.attr('value', value);
    this._callbacks.onChangePlayedProgress(value);
  }

  _bindEvents() {
    this._onMouseInteractionStart = this._onMouseInteractionStart.bind(this);
    this._onMouseInteractionEnd = this._onMouseInteractionEnd.bind(this);
    this._onInputValueChange = this._onInputValueChange.bind(this);

    this.$input[0].addEventListener('input', this._onInputValueChange);
    this.$input[0].addEventListener('change', this._onInputValueChange);

    this.$node[0].addEventListener('mousedown', this._onMouseInteractionStart);
    this.$node[0].addEventListener('mouseup', this._onMouseInteractionEnd);
  }

  setState({ played, buffered }) {
    (played !== undefined) && this._updatePlayed(played);
    (buffered !== undefined) && this._updateBuffered(buffered);
  }

  _updatePlayed(percent) {
    this.$input.val(percent);
    this.$input.attr('value', percent);
    this.$played.attr('value', percent);
  }

  _updateBuffered(percent) {
    this.$buffered.attr('value', percent);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  _unbindEvents() {
    this.$input[0].removeEventListener('input', this._onInputValueChange);
    this.$input[0].removeEventListener('change', this._onInputValueChange);

    this.$node[0].removeEventListener('mousedown', this._onMouseInteractionStart);
    this.$node[0].removeEventListener('mouseup', this._onMouseInteractionEnd);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$input;
    delete this.$played;
    delete this.$buffered;
    delete this.$node;
  }
}
