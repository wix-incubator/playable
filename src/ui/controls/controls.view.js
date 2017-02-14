import $ from 'jbone';

import styles from './controls.scss';


export default class ControlsView {
  constructor() {
    this.$node = $('<div>', {
      class: styles['controls-block'],
      tabIndex: 0
    });

    const background = $('<div>', {
      class: styles['gradient-background']
    });

    this.$controlsContainer = $('<div>', {
      class: styles.controls
    });

    this.$node
      .append(background)
      .append(this.$controlsContainer);
  }
}
