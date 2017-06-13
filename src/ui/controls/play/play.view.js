import $ from 'jbone';

import styles from './play.scss';


export default class PlayView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['play-control']
    });

    this.$playbackControl = $('<div>', {
      class: `${styles['playback-toggle']} ${styles.icon}`,
      'data-hook': 'toggle-playback-button'
    });

    this.$node
      .append(this.$playbackControl);

    this._bindEvents();
  }

  _bindEvents() {
    this.$playbackControl[0].addEventListener('click', this._callbacks.onTogglePlaybackButtonClick);
  }

  _unbindEvents() {
    this.$playbackControl[0].removeEventListener('click', this._callbacks.onTogglePlaybackButtonClick);
  }

  setState({ isPlaying }) {
    this.$playbackControl.toggleClass(styles.paused, !isPlaying);
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

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$playbackControl;
    delete this.$node;
  }
}
