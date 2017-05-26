import $ from 'jbone';

import playIconSVG from '../controls/play/svg/play-icon.svg';
import pauseIconSVG from '../controls/play/svg/pause-icon.svg';

import styles from './screen.scss';


export default class ScreenView {
  constructor({ callbacks, nativeControls }) {
    this.nativeControls = nativeControls;
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['screen-block'],
      tabIndex: 0
    });

    this.$playIconWrapper = $('<div>', {
      class: `${styles['big-icon']} ${styles.disabled}`
    });

    this.$playIcon = $('<img>', {
      src: playIconSVG
    });

    this.$playIconWrapper.append(this.$playIcon);

    this.$pauseIconWrapper = $('<div>', {
      class: `${styles['big-icon']} ${styles.disabled}`
    });

    this.$pauseIcon = $('<img>', {
      src: pauseIconSVG
    });

    this.$pauseIconWrapper.append(this.$pauseIcon);


    this.$node.append(this.$playIconWrapper).append(this.$pauseIconWrapper);

    this._bindEvents();
  }

  _bindEvents() {
    this.$node[0].addEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].addEventListener('keypress', this._callbacks.onWrapperKeyPress);
  }

  activatePlayIcon() {
    this.deactivatePauseIcon();
    this.$playIconWrapper.toggleClass(styles['fade-out'], false);
    this.$playIconWrapper.toggleClass(styles.disabled, false);
    setTimeout(() => this.$playIconWrapper.toggleClass(styles['fade-out'], true), 10);
  }

  deactivatePlayIcon() {
    this.$playIconWrapper.toggleClass(styles.disabled, true);
  }

  activatePauseIcon() {
    this.deactivatePlayIcon();
    this.$pauseIconWrapper.toggleClass(styles['fade-out'], false);
    this.$pauseIconWrapper.toggleClass(styles.disabled, false);
    setTimeout(() => this.$pauseIconWrapper.toggleClass(styles['fade-out'], true), 10);
  }

  deactivatePauseIcon() {
    this.$pauseIconWrapper.toggleClass(styles.disabled, true);
  }

  _deactivatePlayIcon() {
    this.$playIconWrapper.toggleClass(styles.disabled, true);
    this.$playIconWrapper.toggleClass(styles.hidden, false);
  }

  _deactivatePauseIcon() {
    this.$pauseIconWrapper.toggleClass(styles.disabled, true);
    this.$pauseIconWrapper.toggleClass(styles.hidden, false);
  }

  show() {
    this.$node.toggleClass(styles.hidden, false);
  }

  hide() {
    this.$node.toggleClass(styles.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  appendPlaybackViewNode(node) {
    this.$node.append(node);
    if (this.nativeControls) {
      node.setAttribute('controls', 'true');
    }
  }

  _unbindEvents() {
    this.$node[0].removeEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].removeEventListener('keypress', this._callbacks.onWrapperKeyPress);
  }

  appendComponentNode(node) {
    this.$node.append(node);
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$node;
  }
}
