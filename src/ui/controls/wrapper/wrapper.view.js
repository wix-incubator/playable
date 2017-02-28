import $ from 'jbone';

import styles from './wrapper.scss';


export default class ControlsWrapperView {
  constructor() {
    this.$node = $('<div>', {
      class: styles['controls-wrapper'],
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

  show() {
    this.$node.toggleClass(styles.activated, true);
  }

  hide() {
    this.$node.toggleClass(styles.activated, false);
  }

  getNode() {
    return this.$node[0];
  }

  appendControlNode(node) {
    this.$controlsContainer.append(node);
  }

  destroy() {
    this.$node.remove();

    delete this.$controlsContainer;

    delete this.$node;
  }
}
