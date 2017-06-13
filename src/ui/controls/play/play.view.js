import $ from 'jbone';

import styles from './play.scss';

export default class PlayView {
  static _styles = styles;

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
  }

  constructor({ callbacks }) {
    this._callbacks = callbacks;
    this.$node = $('<div>', {
      class: this.styleNames['play-control']
    });

    this.$playbackControl = $('<div>', {
      class: `${this.styleNames['playback-toggle']} ${this.styleNames.icon}`,
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
    this.$playbackControl.toggleClass(this.styleNames.paused, !isPlaying);
  }

  get styleNames() {
    return this.constructor._styles;
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
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
