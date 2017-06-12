import $ from 'jbone';

import styles from './play.scss';


export default class PlayView {
  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: styles['play-control']
    });

    this.$playbackControl = $('<div>', {
      class: `${styles['playback-toggle']} ${styles.icon}`
    });

    this.$node
      .append(this.$playbackControl);

    this._bindEvents();
  }

  _bindEvents() {
    this.$playbackControl.on('click', this._callbacks.onTogglePlaybackButtonClick);
  }

  _unbindEvents() {
    this.$playbackControl.off('click', this._callbacks.onTogglePlaybackButtonClick);
  }
  // Think about changing it for 'changeState' in all controllers
  setPlaybackStatus(isPlaying) {
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
