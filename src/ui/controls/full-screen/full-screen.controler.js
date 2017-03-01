import View from './full-screen.view';


export default class FullScreenControl {
  constructor({ onEnterFullScreenClick, onExitFullScreenClick, view }) {
    this._callbacks = {
      onEnterFullScreenClick,
      onExitFullScreenClick
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
        onEnterFullScreenButtonClick: this._callbacks.onEnterFullScreenClick,
        onExitFullScreenButtonClick: this._callbacks.onExitFullScreenClick
      }
    };

    if (view) {
      this.view = new view(config);
    } else {
      this.view = new View(config);
    }
  }

  setControlStatus(isFullScreen) {
    this.view.setFullScreenStatus(isFullScreen);
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
    delete this._callbacks;
  }
}
