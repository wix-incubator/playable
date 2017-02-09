import $ from 'jbone';

import playIconSVG from '../controls/play/svg/play-icon.svg';

import styles from './overlay.scss';


export default class OverlayView {
  constructor(src) {
    this.$node = $('<div>', {
      class: styles.overlay
    });

    this.$node.css('background-image', `url('${src}')`);

    this.$playWrapper = $('<div>', {
      class: `${styles['play-wrapper']} ${styles.button}`
    });

    this.$playButton = $('<img>', {
      src: playIconSVG
    });

    this.$playTest = $('<span>')
      .html('Play');

    this.$playWrapper
      .append(this.$playButton)
      .append(this.$playTest);

    this.$node
      .append(this.$playWrapper);
  }
}
