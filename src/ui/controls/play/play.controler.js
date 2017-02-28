import View from './play.view';


export default class PlayControl {
  constructor({ onPlayClick, onPauseClick, view }) {
    this._callbacks = {
      onPlayClick,
      onPauseClick
    };

    this._initUI(view);

    this.setControlStatus(false);
  }

  get node() {
    return this.view.getNode();
  }

  _initUI(view) {
    const config = {
      callbacks: {
        onPlayButtonClick: this._callbacks.onPlayClick,
        onPauseButtonClick: this._callbacks.onPauseClick
      }
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new View(config);
    }
  }

  setControlStatus(isPlaying) {
    this.view.setPlaybackStatus(isPlaying);
  }

  destroy() {
    this.view.destroy();
    delete this.view;

    delete this._callbacks;
  }
}
