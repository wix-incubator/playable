import { UIEvent } from '../../../../constants';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';

import View from './picture-in-picture.view';

import { IEventEmitter } from '../../../event-emitter/types';
import { ITooltipService } from '../../core/tooltip/types';
import { IPictureInPictureControl, IPictureInPictureViewConfig } from './types';
import { IPictureInPicture } from '../../../picture-in-picture/types';
import { ITextMap } from '../../../text-map/types';
import { IThemeService } from '../../core/theme';

export default class PictureInPictureControl
  implements IPictureInPictureControl {
  static moduleName = 'pictureInPictureControl';
  static View = View;
  static dependencies = [
    'eventEmitter',
    'pictureInPicture',
    'textMap',
    'tooltipService',
    'theme',
  ];

  private _eventEmitter: IEventEmitter;
  private _pictureInPictureManager: IPictureInPicture;
  private _textMap: ITextMap;
  private _interceptor: KeyboardInterceptor;
  private _tooltipService: ITooltipService;
  private _theme: IThemeService;

  private _unbindEvents: () => void;

  view: View;
  isHidden: boolean;

  constructor({
    eventEmitter,
    pictureInPicture,
    textMap,
    tooltipService,
    theme,
  }: {
    eventEmitter: IEventEmitter;
    pictureInPicture: IPictureInPicture;
    textMap: ITextMap;
    tooltipService: ITooltipService;
    theme: IThemeService;
  }) {
    this._eventEmitter = eventEmitter;
    this._pictureInPictureManager = pictureInPicture;
    this._textMap = textMap;
    this._theme = theme;
    this._tooltipService = tooltipService;

    this._bindCallbacks();

    this._initUI();

    this._bindEvents();

    if (!this._pictureInPictureManager.isEnabled) {
      this.hide();
    }

    this._initInterceptor();
  }

  getElement() {
    return this.view.getElement();
  }

  private _bindCallbacks() {
    this._togglePictureInPicture = this._togglePictureInPicture.bind(this);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [
          UIEvent.PICTURE_IN_PICTURE_STATUS_CHANGE,
          this.view.setPictureInPictureState,
        ],
      ],
      this.view,
    );
  }

  private _initUI() {
    const config: IPictureInPictureViewConfig = {
      callbacks: {
        onButtonClick: this._togglePictureInPicture,
      },
      textMap: this._textMap,
      tooltipService: this._tooltipService,
      theme: this._theme,
    };

    this.view = new PictureInPictureControl.View(config);
  }

  private _initInterceptor() {
    this._interceptor = new KeyboardInterceptor(this.getElement(), {
      [KEYCODES.SPACE_BAR]: (e: Event) => {
        e.stopPropagation();
        this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
      },
      [KEYCODES.ENTER]: (e: Event) => {
        e.stopPropagation();
        this._eventEmitter.emitAsync(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED);
      },
    });
  }

  private _destroyInterceptor() {
    this._interceptor.destroy();
  }

  private _togglePictureInPicture() {
    if (this._pictureInPictureManager.isInPictureInPicture) {
      this._pictureInPictureManager.exitPictureInPicture();
      this._eventEmitter.emitAsync(UIEvent.EXIT_PICTURE_IN_PICTURE_CLICK);
    } else {
      this._pictureInPictureManager.enterPictureInPicture();
      this._eventEmitter.emitAsync(UIEvent.ENTER_PICTURE_IN_PICTURE_CLICK);
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
    this._destroyInterceptor();
    this._unbindEvents();
    this.view.destroy();
  }
}
