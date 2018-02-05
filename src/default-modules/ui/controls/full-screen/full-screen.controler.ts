import { UI_EVENTS } from '../../../../constants/index';

import { IFullScreenViewOptions } from './types';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import { ITooltipService } from '../../core/tooltip';
import View from './full-screen.view';

export default class FullScreenControl {
  static View = View;
  static dependencies = [
    'eventEmitter',
    'fullScreenManager',
    'textMap',
    'tooltipService',
    'theme',
  ];

  private _eventEmitter;
  private _fullScreenManager;
  private _textMap;
  private _interceptor;
  private _tooltipService: ITooltipService;
  private _theme;

  private _isInFullScreen: boolean;

  view: View;
  isHidden: boolean;

  constructor({
    eventEmitter,
    fullScreenManager,
    textMap,
    tooltipService,
    theme,
  }) {
    this._eventEmitter = eventEmitter;
    this._fullScreenManager = fullScreenManager;
    this._textMap = textMap;
    this._theme = theme;
    this._tooltipService = tooltipService;

    this._isInFullScreen = null;

    this._bindCallbacks();

    this._initUI();

    this._bindEvents();

    this.setControlStatus(false);

    if (!this._fullScreenManager.isEnabled) {
      this.hide();
    }

    this._initInterceptor();
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._toggleFullScreen = this._toggleFullScreen.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this.setControlStatus,
      this,
    );
  }

  _initUI() {
    const config: IFullScreenViewOptions = {
      callbacks: {
        onButtonClick: this._toggleFullScreen,
      },
      textMap: this._textMap,
      tooltipService: this._tooltipService,
      theme: this._theme,
    };

    this.view = new FullScreenControl.View(config);
  }

  _initInterceptor() {
    this._interceptor = new KeyboardInterceptor({
      node: this.node,
      callbacks: {
        [KEYCODES.SPACE_BAR]: e => {
          e.stopPropagation();
          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        },
        [KEYCODES.ENTER]: e => {
          e.stopPropagation();
          this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        },
      },
    });
  }

  _destroyInterceptor() {
    this._interceptor.destroy();
  }

  _toggleFullScreen() {
    if (this._isInFullScreen) {
      this._exitFullScreen();
    } else {
      this._enterFullScreen();
    }
  }

  _enterFullScreen() {
    this._fullScreenManager.enterFullScreen();
  }

  _exitFullScreen() {
    this._fullScreenManager.exitFullScreen();
  }

  setControlStatus(isInFullScreen) {
    this._isInFullScreen = isInFullScreen;
    this.view.setState({ isInFullScreen: this._isInFullScreen });
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  _unbindEvents() {
    this._eventEmitter.off(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this.setControlStatus,
      this,
    );
  }

  destroy() {
    this._destroyInterceptor();
    this._unbindEvents();
    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._fullScreenManager;
    delete this._textMap;

    delete this.isHidden;
  }
}
