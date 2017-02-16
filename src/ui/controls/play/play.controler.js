import View from './play.view';

import styles from './play.scss';


export default class PlayControl {
  constructor({ onPlayClick, onPauseClick }) {
    this._callbacks = {
      onPlayClick,
      onPauseClick
    };

    this._initUI();
    this._bindEvents();

    this.toggleControlStatus(false);
  }

  get node() {
    return this.view.$node;
  }

  _initUI() {
    this.view = new View();
  }

  _bindEvents() {
    this.view.$playIcon.on('click', this._callbacks.onPlayClick);
    this.view.$pauseIcon.on('click', this._callbacks.onPauseClick);
  }

  toggleControlStatus(isPlaying) {
    this.view.$playIcon.toggleClass(styles.hidden, isPlaying);
    this.view.$pauseIcon.toggleClass(styles.hidden, !isPlaying);
  }

  _unbindEvents() {
    this.view.$playIcon.off('click', this._callbacks.onPlayClick);
    this.view.$pauseIcon.off('click', this._callbacks.onPauseClick);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._callbacks;
  }
}
