import View from './full-screen.view';

import styles from './full-screen.scss';


export default class FullScreenControl {
  constructor({ onEnterFullScreenClick, onExitFullScreenClick }) {
    this._callbacks = {
      onEnterFullScreenClick,
      onExitFullScreenClick
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
    this.view.$enterIcon.on('click', this._callbacks.onEnterFullScreenClick);
    this.view.$exitIcon.on('click', this._callbacks.onExitFullScreenClick);
  }

  toggleControlStatus(isFullScreen) {
    this.view.$enterIcon.toggleClass(styles.hidden, isFullScreen);
    this.view.$exitIcon.toggleClass(styles.hidden, !isFullScreen);
  }
}
