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
      class: `${styles['big-icon']}`
    });

    this.$playIcon = $('<img>', {
      src: playIconSVG
    });

    this.$playIconWrapper.append(this.$playIcon);

    this.$pauseIconWrapper = $('<div>', {
      class: `${styles['big-icon']}`
    });

    this.$pauseIcon = $('<img>', {
      src: pauseIconSVG
    });

    this.$pauseIconWrapper.append(this.$pauseIcon);


    this._bindEvents();
  }

  _bindEvents() {
    this.$node[0].addEventListener('click', this._callbacks.onWrapperMouseClick);
    this.$node[0].addEventListener('keypress', this._callbacks.onWrapperKeyPress);
  }

  activatePlayIcon() {
    this.deactivatePauseIcon();
    this.$node.append(this.$playIconWrapper);
  }

  deactivatePlayIcon() {
    this.$playIconWrapper.remove();
  }

  activatePauseIcon() {
    this.deactivatePlayIcon();
    this.$node.append(this.$pauseIconWrapper);
  }

  deactivatePauseIcon() {
    this.$pauseIconWrapper.remove();
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
