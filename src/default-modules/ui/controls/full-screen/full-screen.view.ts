import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';
import { IView } from '../../core/types';

import { ITooltipReference } from '../../core/tooltip';
import {
  controlTemplate,
  enterFullScreenIconTemplate,
  exitFullScreenIconTemplate,
} from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import {
  IFullScreenViewStyles,
  IFullScreenViewCallbacks,
  IFullScreenViewConfig,
} from './types';

import fullScreenViewTheme from './full-screen.theme';
import * as styles from './full-screen.scss';

const DATA_IS_IN_FULL_SCREEN = 'data-is-in-full-screen';

class FullScreenView extends View<IFullScreenViewStyles>
  implements IView<IFullScreenViewStyles> {
  private _callbacks: IFullScreenViewCallbacks;
  private _textMap;
  private _tooltipReference: ITooltipReference;

  private _$node: HTMLElement;
  private _$toggleFullScreenControl: HTMLElement;

  constructor(config: IFullScreenViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;
    this._textMap = textMap;

    this._$node = htmlToElement(
      controlTemplate({
        styles: this.styleNames,
        texts: {
          label: this._textMap.get(TEXT_LABELS.ENTER_FULL_SCREEN_LABEL),
        },
      }),
    );

    this._$toggleFullScreenControl = getElementByHook(
      this._$node,
      'full-screen-button',
    );

    this._tooltipReference = tooltipService.createReference(
      this._$toggleFullScreenControl,
      {
        text: this._textMap.get(TEXT_LABELS.ENTER_FULL_SCREEN_TOOLTIP),
      },
    );

    this.setState({ isInFullScreen: false });
    this._bindEvents();
  }

  _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._$toggleFullScreenControl.addEventListener(
      'click',
      this._onButtonClick,
    );
  }

  _unbindEvents() {
    this._$toggleFullScreenControl.removeEventListener(
      'click',
      this._onButtonClick,
    );
  }

  _onButtonClick() {
    this._$toggleFullScreenControl.focus();
    this._callbacks.onButtonClick();
  }

  setState({ isInFullScreen }) {
    if (isInFullScreen) {
      this._$toggleFullScreenControl.classList.add(
        this.styleNames.inFullScreen,
      );
      this._$toggleFullScreenControl.innerHTML = exitFullScreenIconTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
      });
      this._$toggleFullScreenControl.setAttribute(
        'aria-label',
        this._textMap.get(TEXT_LABELS.EXIT_FULL_SCREEN_LABEL),
      );

      this._tooltipReference.setText(
        this._textMap.get(TEXT_LABELS.EXIT_FULL_SCREEN_TOOLTIP),
      );
    } else {
      this._$toggleFullScreenControl.classList.remove(
        this.styleNames.inFullScreen,
      );
      this._$toggleFullScreenControl.innerHTML = enterFullScreenIconTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
      });
      this._$toggleFullScreenControl.setAttribute(
        'aria-label',
        this._textMap.get(TEXT_LABELS.ENTER_FULL_SCREEN_LABEL),
      );

      this._tooltipReference.setText(
        this._textMap.get(TEXT_LABELS.ENTER_FULL_SCREEN_TOOLTIP),
      );
    }

    this._$node.setAttribute(DATA_IS_IN_FULL_SCREEN, isInFullScreen);
  }

  hide() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  getNode() {
    return this._$node;
  }

  destroy() {
    this._unbindEvents();
    this._tooltipReference.destroy();

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }
    delete this._$toggleFullScreenControl;
    delete this._$node;

    delete this._textMap;
  }
}

FullScreenView.setTheme(fullScreenViewTheme);
FullScreenView.extendStyleNames(styles);

export default FullScreenView;
