import View from './title.view';

import { UI_EVENTS } from '../../../constants/index';

import playerAPI from '../../../utils/player-api-decorator';

export default class TitleControl {
  static View = View;
  static dependencies = ['rootContainer', 'screen', 'eventEmitter', 'config'];

  private _callback;
  private _screen;
  private _eventEmitter;

  view: View;
  isHidden: boolean;

  constructor({ rootContainer, screen, eventEmitter, config }) {
    this._screen = screen;
    this._eventEmitter = eventEmitter;

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();
    this.setTitle(config.ui.title);

    rootContainer.appendComponentNode(this.node);
  }

  get node() {
    return this.view.getNode();
  }

  _bindEvents() {
    this._eventEmitter.on(
      UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED,
      this._fadeOut,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED,
      this._fadeIn,
      this,
    );
  }

  _unbindEvents() {
    this._eventEmitter.off(
      UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED,
      this._fadeOut,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED,
      this._fadeIn,
      this,
    );
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

  _fadeIn() {
    // TODO: do we need to change `this.isHidden` here?
    this._screen.showTopShadow();
    this.view.fadeIn();
  }

  _fadeOut() {
    // TODO: do we need to change `this.isHidden` here?
    this._screen.hideTopShadow();
    this.view.fadeOut();
  }

  hide() {
    this.isHidden = true;
    this._screen.hideTopShadow();
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this._screen.showTopShadow();
    this.view.show();
  }

  destroy() {
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._screen;
    delete this._eventEmitter;

    delete this.isHidden;
  }
}
