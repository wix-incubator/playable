import $ from 'jbone';

import styles from './progress.scss';


export default class ProgressView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['progress-bar']
    });

    this.$clickWrapper = $('<div>', {

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
      type: 'range',
      min: 0,
      max: 100,
      step: 0.1,
      value: 0
    });

    this.$clickWrapper
      .append(this.$input)
      .append(this.$played)
      .append(this.$buffered);

    this.$node.append(this.$clickWrapper);

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

    this.$clickWrapper[0].addEventListener('mousedown', this._onMouseInteractionStart);
    this.$clickWrapper[0].addEventListener('mouseup', this._onMouseInteractionEnd);
  }

  updatePlayed(percent) {
    this.$input.val(percent);
    this.$input.attr('value', percent);
    this.$played.attr('value', percent);
  }

  updateBuffered(percent) {
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

    this.$clickWrapper[0].removeEventListener('mousedown', this._onMouseInteractionStart);
    this.$clickWrapper[0].removeEventListener('mouseup', this._onMouseInteractionEnd);
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
