import View from './title.view';

import playerAPI from '../../../utils/player-api-decorator';

export default class TitleControl {
  static View = View;
  static dependencies = ['rootContainer'];

  private _callback;

  view: View;
  isHidden: boolean;

  constructor({ rootContainer }) {
    this._bindCallbacks();
    this._initUI();

    rootContainer.appendComponentNode(this.node);
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._triggerCallback = this._triggerCallback.bind(this);
  }

  _initUI() {
    const config = {
      callbacks: {
        onClick: this._triggerCallback,
      },
    };

    this.view = new TitleControl.View(config);

    this.view.setTitle();
  }

  @playerAPI()
  setTitle(url) {
    this.view.setTitle(url);
  }

  @playerAPI()
  setTitleClickCallback(callback) {
    this._callback = callback;
    this.view.setDisplayAsLink(Boolean(this._callback));
  }

  _triggerCallback() {
    if (this._callback) {
      this._callback();
    }
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
  }
}
