import $ from 'jbone';

import styles from './loader.scss';


export default class LoaderView {
  constructor() {
    this.$node = $('<div>', {
      class: styles.loader
    });
  }

  getNode() {
    return this.$node[0];
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  destroy() {
    this.$node.remove();

    delete this.$content;
    delete this.$playButton;
    delete this.$node;
  }
}
