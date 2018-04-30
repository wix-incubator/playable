import View from './title.view';

import playerAPI from '../../../core/player-api-decorator';

import { IThemeService } from '../core/theme';
import { ITitleViewConfig } from './types';

export default class TitleControl {
  static moduleName = 'title';
  static View = View;
  static dependencies = ['config', 'theme'];

  private _callback: Function;
  private _theme: IThemeService;

  view: View;
  isHidden: boolean;

  constructor({ config, theme }) {
    this._theme = theme;

    this._bindCallbacks();
    this._initUI();
    if (config.title) {
      this.setTitleClickCallback(config.title.callback || null);
      this.setTitle(config.title.text);
    } else if (config.title === false) {
      this.hide();
    }
  }

  get node() {
    return this.view.getNode();
  }

  private _bindCallbacks() {
    this._triggerCallback = this._triggerCallback.bind(this);
  }

  private _initUI() {
    const config: ITitleViewConfig = {
      theme: this._theme,
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
   * [Live Demo](https://jsfiddle.net/bodia/243k6m0u/)
   */
  @playerAPI()
  setTitle(title?: string) {
    this.view.setTitle(title);
  }

  /**
   * Method for attaching callback for click on title
   *
   * @param callback - Your function
   *
   * @example
   * const callback = () => {
   *   console.log('Click on title);
   * }
   * player.setTitleClickCallback(callback);
   *
   */
  @playerAPI()
  setTitleClickCallback(callback?: Function) {
    this._callback = callback;
    this.view.setDisplayAsLink(Boolean(this._callback));
  }

  private _triggerCallback() {
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
