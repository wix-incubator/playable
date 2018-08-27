import playerAPI from '../../../../core/player-api-decorator';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import { UI_EVENTS } from '../../../../constants';
import View from './logo.view';

import { IEventEmitter } from '../../../event-emitter/types';
import { ITooltipService } from '../../core/tooltip/types';
import { ILogoControl, ILogoViewConfig } from './types';
import { ITextMap } from '../../../text-map/types';
import { IPlayerConfig } from '../../../../core/config';
import { IThemeService } from '../../core/theme';

export default class Logo implements ILogoControl {
  static moduleName = 'logo';
  static View = View;
  static dependencies = [
    'config',
    'eventEmitter',
    'textMap',
    'tooltipService',
    'theme',
  ];

  private _eventEmitter: IEventEmitter;
  private _textMap: ITextMap;
  private _theme: IThemeService;
  private _tooltipService: ITooltipService;

  private _interceptor: KeyboardInterceptor;
  private _callback: Function;

  view: View;
  isHidden: boolean;

  constructor({
    eventEmitter,
    config,
    textMap,
    tooltipService,
    theme,
  }: {
    eventEmitter: IEventEmitter;
    config: IPlayerConfig;
    textMap: ITextMap;
    tooltipService: ITooltipService;
    theme: IThemeService;
  }) {
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._theme = theme;
    this._tooltipService = tooltipService;

    this._bindCallbacks();

    this._initUI();
    this._initInterceptor();

    const logoConfig = {
      ...(typeof config.logo === 'object' ? config.logo : {}),
    };

    this.setLogo(logoConfig.src);
    this.setLogoClickCallback(logoConfig.callback);
  }

  get node() {
    return this.view.getNode();
  }

  private _bindCallbacks() {
    this._triggerCallback = this._triggerCallback.bind(this);
  }

  private _initUI() {
    const config: ILogoViewConfig = {
      theme: this._theme,
      callbacks: {
        onLogoClick: this._triggerCallback,
      },
      textMap: this._textMap,
      tooltipService: this._tooltipService,
    };

    this.view = new Logo.View(config);
  }

  private _initInterceptor() {
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

  private _destroyInterceptor() {
    this._interceptor.destroy();
  }

  private _triggerCallback() {
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
    this.view = null;

    this._eventEmitter = null;
    this._textMap = null;
    this._theme = null;
  }
}
