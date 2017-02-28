import View from './progress.view';


export default class ProgressControl {
  constructor({
    onProgressChange = _ => _,
    onInteractionStart = _ => _,
    onInteractionEnd = _ => _,
    view
  }) {
    this._isUserInteracting = false;
    this.currentProgress = 0;


    this._callbacks = {
      onInteractionStart,
      onInteractionEnd,
      onProgressChange
    };

    this._bindCallbacks();
    this._initUI(view);
  }

  get node() {
    return this.view.getNode();
  }

  _initUI(view) {
    const config = {
      callbacks: {
        onChangePlayedProgress: this._changePlayedProgress,
        onUserInteractionStart: this._toggleUserInteractingStatus,
        onUserInteractionEnd: this._toggleUserInteractingStatus
      }
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new View(config);
    }
  }

  _bindCallbacks() {
    this._changePlayedProgress = this._changePlayedProgress.bind(this);
    this._toggleUserInteractingStatus = this._toggleUserInteractingStatus.bind(this);
  }

  _changePlayedProgress(value) {
    if (this.currentProgress === value) {
      return;
    }

    this.currentProgress = value;
    this._callbacks.onProgressChange(this.currentProgress / 100);
  }

  _toggleUserInteractingStatus() {
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
      this.view.updatePlayed(this.currentProgress);
    }
  }

  updateBuffered(percent) {
    this.view.updateBuffered(percent);
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  destroy() {
    this.view.destroy();
    delete this.view;

    delete this.isHidden;
    delete this.currentProgress;
    delete this._callbacks;

    this._isUserInteracting = null;
    this.currentProgress = null;
  }
}
