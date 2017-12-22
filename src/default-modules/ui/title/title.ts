import View from './title.view';

import playerAPI from '../../../utils/player-api-decorator';

export default class TitleControl {
  static View = View;
  static dependencies = ['config'];

  private _callback;

  view: View;
  isHidden: boolean;

  constructor({ config }) {
    this._bindCallbacks();
    this._initUI();
    this.setTitle(config.ui.title);
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

  /**
   * Display title text over the video. If you want to have clickable title, use `setTitleClickCallback`
   *
   * @param title - Text for the video title
   *
   * @example
   * player.setTitle('Your awesome video title here');
   *
   * @note
   * [Live Demo](https://jsfiddle.net/kupriyanenko/ao0rg48s/2/)
   */
  @playerAPI()
  setTitle(title?: string) {
    this.view.setTitle(title);
  }

  @playerAPI()
  setTitleClickCallback(callback?: Function) {
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
