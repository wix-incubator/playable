import $ from 'jbone';

import View from '../../core/view';

import styles from './play.scss';


class PlayView extends View {
  constructor(config) {
    super(config);
    const { callbacks } = config;

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

PlayView.extendStyleNames(styles);

export default PlayView;
