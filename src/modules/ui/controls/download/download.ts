import playerAPI from '../../../../core/player-api-decorator';

import { UIEvent } from '../../../../constants';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import View from './download.view';

import { IEventEmitter } from '../../../event-emitter/types';
import { ITooltipService } from '../../core/tooltip/types';
import {
  IDownloadButtonAPI,
  IDownloadButton,
  IDownloadViewConfig,
} from './types';
import { ITextMap } from '../../../text-map/types';
import { IThemeService } from '../../core/theme';

class DownloadButton implements IDownloadButton {
  static moduleName = 'downloadButton';
  static View = View;
  static dependencies = ['eventEmitter', 'textMap', 'tooltipService', 'theme'];

  private _eventEmitter: IEventEmitter;
  private _textMap: ITextMap;
  private _interceptor: KeyboardInterceptor;
  private _tooltipService: ITooltipService;
  private _theme: IThemeService;

  private _callback: () => void;

  view: View;
  isHidden: boolean;

  constructor({
    eventEmitter,
    textMap,
    tooltipService,
    theme,
  }: {
    eventEmitter: IEventEmitter;
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
  }

  getElement() {
    return this.view.getElement();
  }

  private _bindCallbacks() {
    this._triggerCallback = this._triggerCallback.bind(this);
  }

  private _initUI() {
    const config: IDownloadViewConfig = {
      callbacks: {
        onButtonClick: this._triggerCallback,
      },
      textMap: this._textMap,
      tooltipService: this._tooltipService,
      theme: this._theme,
    };

    this.view = new DownloadButton.View(config);
  }

  private _initInterceptor() {
    this._interceptor = new KeyboardInterceptor(this.getElement(), {
      [KEYCODES.SPACE_BAR]: (e: Event) => {
        e.stopPropagation();
        this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._triggerCallback();
      },
      [KEYCODES.ENTER]: (e: Event) => {
        e.stopPropagation();
        this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
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

  @playerAPI()
  setDownloadClickCallback(callback: () => void) {
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
  }
}

export { IDownloadButtonAPI };
export default DownloadButton;
