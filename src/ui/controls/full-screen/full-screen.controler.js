import View from './full-screen.view';

import styles from './full-screen.scss';


export default class FullScreenControl {
  constructor({ onEnterFullScreenClick, onExitFullScreenClick }) {
    this._callbacks = {
      onEnterFullScreenClick,
      onExitFullScreenClick
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
    this.view.$enterIcon.on('click', this._callbacks.onEnterFullScreenClick);
    this.view.$exitIcon.on('click', this._callbacks.onExitFullScreenClick);
  }

  toggleControlStatus(isFullScreen) {
    this.view.$enterIcon.toggleClass(styles.hidden, isFullScreen);
    this.view.$exitIcon.toggleClass(styles.hidden, !isFullScreen);
  }

  hide() {
    this.isHidden = true;
    this.view.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.isHidden = false;
    this.view.$node.toggleClass(styles.hidden, false);
  }

  _unbindEvents() {
    this.view.$enterIcon.off('click', this._callbacks.onEnterFullScreenClick);
    this.view.$exitIcon.off('click', this._callbacks.onExitFullScreenClick);
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this.isHidden;
    delete this._callbacks;
  }
}
