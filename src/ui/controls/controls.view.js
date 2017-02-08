import $ from 'jbone';

import styles from './controls.scss';


export default class ControlsView {
  constructor() {
    this.$node = $('<div>', {
      class: styles['controls-block']
    });

    this.$wrapper = $('<div>', {
      class: styles['controls-wrapper']
    });

    this.$controlsContainer = $('<div>', {
      class: styles.controls
    });

    this.$wrapper
      .append(this.$controlsContainer);

    this.$node
      .append(this.$wrapper);
  }
}
