import $ from 'jbone';

import styles from './ui.scss';


export default class PlayerUIView {
  constructor(width, height) {
    this.$node = $('<div>', {
      class: styles['video-wrapper']
    });

    if (width) {
      this.$node.css({
        width: `${width}px`
      });
    }

    if (height) {
      this.$node.css({
        height: `${height}px`
      });
    }
  }

  destroy() {
    this.$node.remove();

    delete this.$node;
  }
}
