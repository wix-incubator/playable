import playerAPI from '../../../../core/player-api-decorator';

import { ILogoViewConfig } from './types';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import { UI_EVENTS } from '../../../../constants/index';
import { ITooltipService } from '../../core/tooltip';
import View from './logo.view';

export interface ILogoConfig {
  callback?: Function;
  src?: string;
  showAlways?: boolean;
}

export default class Logo {
  static moduleName = 'logo';
  static View = View;
  static dependencies = [
    'engine',
    'config',
    'eventEmitter',
    'textMap',
    'tooltipService',
  ];

  private _eventEmitter;
  private _engine;
  private _textMap;
  private _tooltipService: ITooltipService;

  private _interceptor;
  private _callback;

  view: View;
  isHidden: boolean;

  constructor({ engine, eventEmitter, config, textMap, tooltipService }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._textMap = textMap;
    this._tooltipService = tooltipService;

    this._bindCallbacks();

    this._initUI();
    this._initInterceptor();

    const logoConfig = {
      ...config.logo,
    };

    this.setLogo(logoConfig.src);
    this.setLogoClickCallback(logoConfig.callback);
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._triggerCallback = this._triggerCallback.bind(this);
  }

  _initUI() {
    const config: ILogoViewConfig = {
      callbacks: {
        onLogoClick: this._triggerCallback,
      },
      textMap: this._textMap,
      tooltipService: this._tooltipService,
    };

    this.view = new Logo.View(config);
  }

  _initInterceptor() {
    this._interceptor = new KeyboardInterceptor(this.node, {
      [KEYCODES.SPACE_BAR]: e => {
        e.stopPropagation();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._triggerCallback();
      },
      [KEYCODES.ENTER]: e => {
        e.stopPropagation();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._triggerCallback();
      },
    });
  }

  _destroyInterceptor() {
    this._interceptor.destroy();
  }

  _triggerCallback() {
    if (this._callback) {
      this._callback();
    }
  }

  /**
   * Method for setting source of image, that would be used as logo
   * @param src - Source of logo
   * @example
   * player.setLogo('https://example.com/logo.png');
   *
   */
  @playerAPI()
  setLogo(src: string) {
    this.view.setLogo(src);
  }

  /**
   * Method for attaching callback for click on logo
   *
   * @param callback - Your function
   *
   * @example
   * const callback = () => {
   *   console.log('Click on title);
   * }
   * player.setLogoClickCallback(callback);
   *
   */
  @playerAPI()
  setLogoClickCallback(callback?: Function) {
    this._callback = callback;
    this.view.setDisplayAsLink(Boolean(this._callback));
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
    this._destroyInterceptor();
    this.view.destroy();
    delete this.view;

    delete this._engine;
    delete this._eventEmitter;
    delete this._textMap;

    delete this.isHidden;
  }
}
