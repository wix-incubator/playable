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
import { IBottomBlock } from '../../bottom-block/types';
import { ChromecastEvents } from '../../../chromecast-manager/chromecast-manager';

export default class ChromecaststButton implements IChromecaststButton {
  static moduleName = 'chromecastButton';
  static View = View;
  static dependencies = [
    'eventEmitter',
    'textMap',
    'tooltipService',
    'theme',
    'chromecastManager',
    'bottomBlock',
  ];

  private _eventEmitter: IEventEmitter;
  private _textMap: ITextMap;
  private _interceptor: KeyboardInterceptor;
  private _tooltipService: ITooltipService;
  private _theme: IThemeService;
  private _chromecastManager: IChromecastManager;
  private _bottomBlock: IBottomBlock;

  private _callback: Function;

  view: View;
  isHidden: boolean;
  private _unbindEvents: () => void;

  constructor({
    eventEmitter,
    textMap,
    tooltipService,
    theme,
    chromecastManager,
    bottomBlock,
  }: {
    eventEmitter: IEventEmitter;
    textMap: ITextMap;
    tooltipService: ITooltipService;
    theme: IThemeService;
    chromecastManager: IChromecastManager;
    bottomBlock: IBottomBlock;
  }) {
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._theme = theme;
    this._tooltipService = tooltipService;
    this._chromecastManager = chromecastManager;
    this._bottomBlock = bottomBlock;

    this._bindCallbacks();

    this._initUI();
    this._initInterceptor();
    this._bindEvents();
    this._connectToPanel();
  }

  getElement() {
    return this.view.getElement();
  }

  private _connectToPanel() {
    this._bottomBlock.addControl(
      ChromecaststButton.moduleName,
      this.getElement(),
    );
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
    const setStateToCast = () => this.view.setCastingState(true);
    const resetStateFromCast = () => this.view.setCastingState(true);

    this._unbindEvents = this._eventEmitter.bindEvents([
      [ChromecastEvents.CHROMECAST_INITED, () => show()],
      [ChromecastEvents.CHROMECAST_CASTS_STARTED, setStateToCast],
      [ChromecastEvents.CHROMECAST_CASTS_RESUMED, setStateToCast],
      [ChromecastEvents.CHROMECAST_CASTS_STOPED, resetStateFromCast],
    ]);
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
    this._unbindEvents();

    this._chromecastManager.destroy();
  }
}
