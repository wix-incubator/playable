import $ from 'jbone';

import playIconSVG from '../static/svg/controls/play-icon.svg';


import styles from './scss/index.scss';


export default class Overlay {
  constructor({ src, onPlayClick }) {
    this.isHidden = false;

    this.backgroundSrc = src;
    this.callbacks = {
      onPlayClick
    };

    this._initUI();
  }

  get node() {
    return this.$node;
  }

  _initUI() {
    this.$node = $('<div>', {
      class: styles.overlay
    });

    this.$node.css('background-image', `url('${this.backgroundSrc}')`);

    this.$playWrapper = $('<div>', {
      class: styles['play-wrapper']
    })
      .on('click', this.callbacks.onPlayClick);

    this.$playButton = $('<img>', {
      src: playIconSVG
    });

    this.$playWrapper.append(this.$playButton);

    this.$node
      .append(this.$playWrapper);
  }

  toggleOverlay() {
    if (this.isHidden) {
      this.showOverlay();
    } else {
      this.hideOverlay();
    }
  }

  hideOverlay() {
    this.isHidden = true;
    this.$node.addClass(styles.hidden);
  }

  showOverlay() {
    this.isHidden = false;
    this.$node.removeClass(styles.hidden);
  }
}
