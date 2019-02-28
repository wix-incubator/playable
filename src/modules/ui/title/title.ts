import View from './title.view';

import playerAPI from '../../../core/player-api-decorator';

import { IThemeService } from '../core/theme';
import { ITitleAPI, ITitle, ITitleViewConfig } from './types';
import { IPlayerConfig } from '../../../core/config';

class Title implements ITitle {
  static moduleName = 'title';
  static View = View;
  static dependencies = ['config', 'theme'];

  private _callback: () => void;
  private _theme: IThemeService;

  view: View;
  isHidden: boolean;

  constructor({
    theme,
    config,
  }: {
    theme: IThemeService;
    config: IPlayerConfig;
  }) {
    this._theme = theme;

    this._bindCallbacks();
    this._initUI();

    this.setTitle(config.title);
  }

  getElement() {
    return this.view.getElement();
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

    this.view = new Title.View(config);

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
  setTitleClickCallback(callback?: () => void) {
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
  }
}

export { ITitleAPI };
export default Title;
