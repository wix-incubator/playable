import $ from 'jbone';

import styles from './progress.scss';


export default class ProgressView {
  constructor() {
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
}
