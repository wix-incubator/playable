import $ from 'jbone';

import styles from './ui.scss';


export default class PlayerUIView {
  constructor() {
    this.$node = $('<div>', {
      class: styles['video-wrapper']
    });
  }
}
