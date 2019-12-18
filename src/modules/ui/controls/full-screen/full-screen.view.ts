import { TextLabel } from '../../../../constants';

import View from '../../core/view';
import { IView } from '../../core/types';

import { ITooltipReference } from '../../core/tooltip/types';
import { controlTemplate } from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import { ITextMap } from '../../../text-map/types';

import {
  IFullScreenViewStyles,
  IFullScreenViewCallbacks,
  IFullScreenViewConfig,
} from './types';

import fullScreenViewTheme from './full-screen.theme';
import styles from './full-screen.scss';

class FullScreenView extends View<IFullScreenViewStyles>
  implements IView<IFullScreenViewStyles> {
  private _callbacks: IFullScreenViewCallbacks;
  private _textMap: ITextMap;
  private _tooltipReference: ITooltipReference;

  private _$rootElement: HTMLElement;
  private _$toggleFullScreenControl: HTMLElement;

  constructor(config: IFullScreenViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;
    this._textMap = textMap;

    this._$rootElement = htmlToElement(
      controlTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {
          label: this._textMap.get(TextLabel.ENTER_FULL_SCREEN_LABEL),
        },
      }),
    );

    this._$toggleFullScreenControl = getElementByHook(
      this._$rootElement,
      'full-screen-button',
    );

    this._tooltipReference = tooltipService.createReference(
      this._$toggleFullScreenControl,
      {
        text: this._textMap.get(TextLabel.ENTER_FULL_SCREEN_TOOLTIP),
      },
    );

    this.setFullScreenState(false);
    this._bindEvents();
  }

  private _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._$toggleFullScreenControl.addEventListener(
      'click',
      this._onButtonClick,
    );
  }

  private _unbindEvents() {
    this._$toggleFullScreenControl.removeEventListener(
      'click',
      this._onButtonClick,
    );
  }

  private _onButtonClick() {
    this._$toggleFullScreenControl.focus();
    this._callbacks.onButtonClick();
  }

  //TODO: No need to create icons every tims on setState
  setFullScreenState(isInFullScreen: boolean) {
    if (isInFullScreen) {
      this._$toggleFullScreenControl.classList.add(
        this.styleNames.inFullScreen,
      );
      this._$toggleFullScreenControl.setAttribute(
        'aria-label',
        this._textMap.get(TextLabel.EXIT_FULL_SCREEN_LABEL),
      );

      this._tooltipReference.setText(
        this._textMap.get(TextLabel.EXIT_FULL_SCREEN_TOOLTIP),
      );
    } else {
      this._$toggleFullScreenControl.classList.remove(
        this.styleNames.inFullScreen,
      );
      this._$toggleFullScreenControl.setAttribute(
        'aria-label',
        this._textMap.get(TextLabel.ENTER_FULL_SCREEN_LABEL),
      );

      this._tooltipReference.setText(
        this._textMap.get(TextLabel.ENTER_FULL_SCREEN_TOOLTIP),
      );
    }
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  getElement() {
    return this._$rootElement;
  }

  destroy() {
    this._unbindEvents();

    this._tooltipReference.destroy();

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$toggleFullScreenControl = null;
    this._$rootElement = null;
  }
}

FullScreenView.setTheme(fullScreenViewTheme);
FullScreenView.extendStyleNames(styles);

export default FullScreenView;
