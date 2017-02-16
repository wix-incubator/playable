import View from './progress.view';

import styles from '../../shared.scss';


export default class ProgressControl {
  constructor({
    onProgressChange = _ => _,
    onInteractionStart = _ => _,
    onInteractionEnd = _ => _
  }) {
    this._isUserInteracting = false;
    this.currentProgress = 0;


    this._callbacks = {
      onInteractionStart,
      onInteractionEnd,
      onProgressChange
    };

    this._initUI();
    this._initEvents();
  }

  get node() {
    return this.view.$node;
  }

  _initUI() {
    this.view = new View();
  }

  _initEvents() {
    this._changePlayedProgress = this._changePlayedProgress.bind(this);
    this._toggleUserInteractingStatus = this._toggleUserInteractingStatus.bind(this);

    this.view.$input
      .on('input', this._changePlayedProgress)
      .on('change', this._changePlayedProgress)
      .on('mousedown', this._toggleUserInteractingStatus)
      .on('mouseup', this._toggleUserInteractingStatus);
  }

  _changePlayedProgress() {
    if (this.currentProgress !== this.view.$input.val()) {
      this.currentProgress = this.view.$input.val();
      this._callbacks.onProgressChange(this.currentProgress / this.view.$input.attr('max'));
      this.view.$played.attr('value', this.currentProgress);
    }
  }

  _toggleUserInteractingStatus(e) {
    if (e.buttons > 1) {
      return;
    }

    this._isUserInteracting = !this._isUserInteracting;
    if (this._isUserInteracting) {
      this._callbacks.onInteractionStart();
    } else {
      this._callbacks.onInteractionEnd();
    }
  }

  updatePlayed(percent) {
    if (!this._isUserInteracting) {
      this.currentProgress = percent;
      this.view.$input.val(this.currentProgress);
      this.view.$input.attr('value', this.currentProgress);
      this.view.$played.attr('value', this.currentProgress);
    }
  }

  updateBuffered(percent) {
    this.view.$buffered.attr('value', percent);
  }

  hide() {
    this.isHidden = true;
    this.view.$node.toggleClass(styles.hidden, true);
  }

  show() {
    this.isHidden = false;
    this.view.$node.toggleClass(styles.hidden, false);
  }
}
