import View from './play.view';

import styles from './play.scss';


export default class PlayControl {
  constructor({ onPlayClick, onPauseClick }) {
    this.isPlaying = false;

    this._callbacks = {
      onPlayClick,
      onPauseClick
    };

    this._initUI();
    this._initEvents();

    this.toggleControlStatus(false);
  }

  get node() {
    return this.view.$node;
  }

  _initUI() {
    this.view = new View();
  }

  _initEvents() {
    this.view.$playIcon.on('click', this._callbacks.onPlayClick);
    this.view.$pauseIcon.on('click', this._callbacks.onPauseClick);
  }

  toggleControlStatus(isPlaying) {
    this.isPlaying = isPlaying;

    this.view.$playIcon.toggleClass(styles.hidden, isPlaying);
    this.view.$pauseIcon.toggleClass(styles.hidden, !isPlaying);
  }
}
