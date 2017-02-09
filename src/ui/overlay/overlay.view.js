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
      class: styles['play-wrapper']
    });

    this.$playButton = $('<img>', {
      src: playIconSVG
    });

    this.$playWrapper.append(this.$playButton);

    this.$node
      .append(this.$playWrapper);
  }
}
