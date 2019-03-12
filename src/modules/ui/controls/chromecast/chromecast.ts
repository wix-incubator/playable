import playerAPI from '../../../../core/player-api-decorator';

import { UI_EVENTS } from '../../../../constants';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import View from './chromecast.view';

import { IEventEmitter } from '../../../event-emitter/types';
import { ITooltipService } from '../../core/tooltip/types';
import { IChromecaststButton, IChromecaststViewConfig } from './types';
import { ITextMap } from '../../../text-map/types';
import { IThemeService } from '../../core/theme';
import { IChromecastManager } from '../../../chromecast-manager/types';

export default class ChromecaststButton implements IChromecaststButton {
  static moduleName = 'chromecastButton';
  static View = View;
  static dependencies = [
    'eventEmitter',
    'textMap',
    'tooltipService',
    'theme',
    'chromecastManager',
  ];

  private _eventEmitter: IEventEmitter;
  private _textMap: ITextMap;
  private _interceptor: KeyboardInterceptor;
  private _tooltipService: ITooltipService;
  private _theme: IThemeService;
  private _chromecastManager: IChromecastManager;

  private _callback: Function;

  view: View;
  isHidden: boolean;

  constructor({
    eventEmitter,
    textMap,
    tooltipService,
    theme,
    chromecastManager,
  }: {
    eventEmitter: IEventEmitter;
    textMap: ITextMap;
    tooltipService: ITooltipService;
    theme: IThemeService;
    chromecastManager: IChromecastManager;
  }) {
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._theme = theme;
    this._tooltipService = tooltipService;
    this._chromecastManager = chromecastManager;

    this._bindCallbacks();

    this._initUI();
    this._initInterceptor();
    this._bindEvents();
  }

  getElement() {
    return this.view.getElement();
  }

  private _bindCallbacks() {
    this._triggerCallback = this._triggerCallback.bind(this);
  }

  private _initUI() {
    const config: IChromecaststViewConfig = {
      callbacks: {
        onButtonClick: this._triggerCallback,
      },
      textMap: this._textMap,
      tooltipService: this._tooltipService,
      theme: this._theme,
    };

    this.view = new ChromecaststButton.View(config);
    this.hide();
  }

  private _initInterceptor() {
    this._interceptor = new KeyboardInterceptor(this.getElement(), {
      [KEYCODES.SPACE_BAR]: (e: Event) => {
        e.stopPropagation();
        this._eventEmitter.emitAsync(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._triggerCallback();
      },
      [KEYCODES.ENTER]: (e: Event) => {
        e.stopPropagation();
        this._eventEmitter.emitAsync(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._triggerCallback();
      },
    });
  }

  private _bindEvents() {
    const show = this.show.bind(this);
    this._eventEmitter.on(UI_EVENTS.CHROMECAST_INITED, () => {
      show();
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

  @playerAPI()
  setChromecaststButtonCallback(callback: Function) {
    this._callback = callback;
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

    this._chromecastManager.destroy();

    this._eventEmitter = null;
    this._textMap = null;
    this._theme = null;
  }
}
