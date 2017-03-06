import $ from 'jbone';

import playIconSVG from '../controls/play/svg/play-icon.svg';

import styles from './overlay.scss';


export default class OverlayView {
  constructor({ callbacks, src }) {
    this._callbacks = callbacks;

    this.$node = $('<div>');

    this.$content = $('<div>', {
      class: styles.overlay
    });

    if (src) {
      this.$content.css('background-image', `url('${src}')`);
    }

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

    this.$content
      .append(this.$playWrapper);

    this.$node
      .append(this.$content);

    this._bindEvents();
  }

  _bindEvents() {
    this.$playWrapper.on('click', this._callbacks.onPlayClick);
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

  setBackgroundSrc(src) {
    this.$content.css('background-image', `url('${src}')`);
  }

  _unbindEvents() {
    this.$playWrapper.off('click', this._callbacks.onPlayClick);
  }

  destroy() {
    this._unbindEvents();

    this.$node.remove();

    delete this.$content;
    delete this.$playWrapper;
    delete this.$playButton;
    delete this.$playTest;
    delete this.$node;
  }
}
