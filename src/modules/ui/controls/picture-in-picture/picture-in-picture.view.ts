import { TextLabel } from '../../../../constants';

import View from '../../core/view';
import { IView } from '../../core/types';

import { ITooltipReference } from '../../core/tooltip/types';
import { controlTemplate } from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import { ITextMap } from '../../../text-map/types';

import {
  IPictureInPictureViewStyles,
  IPictureInPictureViewCallbacks,
  IPictureInPictureViewConfig,
} from './types';

import pictureInPictureViewTheme from './picture-in-picture.theme';
import styles from './picture-in-picture.scss';

class PictureInPictureView extends View<IPictureInPictureViewStyles>
  implements IView<IPictureInPictureViewStyles> {
  private _callbacks: IPictureInPictureViewCallbacks;
  private _textMap: ITextMap;
  private _tooltipReference: ITooltipReference;

  private _$rootElement: HTMLElement;
  private _$togglePictureInPictureControl: HTMLElement;

  constructor(config: IPictureInPictureViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;
    this._textMap = textMap;

    this._$rootElement = htmlToElement(
      controlTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {
          label: this._textMap.get(TextLabel.ENTER_PICTURE_IN_PICTURE_LABEL),
        },
      }),
    );

    this._$togglePictureInPictureControl = getElementByHook(
      this._$rootElement,
      'picture-in-picture-control',
    );

    this._tooltipReference = tooltipService.createReference(
      this._$togglePictureInPictureControl,
      {
        text: this._textMap.get(TextLabel.ENTER_PICTURE_IN_PICTURE_TOOLTIP),
      },
    );

    this.setPictureInPictureState(false);
    this._bindEvents();
  }

  private _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._$togglePictureInPictureControl.addEventListener(
      'click',
      this._onButtonClick,
    );
  }

  private _unbindEvents() {
    this._$togglePictureInPictureControl.removeEventListener(
      'click',
      this._onButtonClick,
    );
  }

  private _onButtonClick() {
    this._callbacks.onButtonClick();
  }

  setPictureInPictureState(isPictureInPicture: boolean) {
    if (isPictureInPicture) {
      this._$togglePictureInPictureControl.classList.add(
        this.styleNames.inPictureInPicture,
      );
      this._$togglePictureInPictureControl.setAttribute(
        'aria-label',
        this._textMap.get(TextLabel.EXIT_PICTURE_IN_PICTURE_LABEL),
      );

      this._tooltipReference.setText(
        this._textMap.get(TextLabel.EXIT_PICTURE_IN_PICTURE_TOOLTIP),
      );
    } else {
      this._$togglePictureInPictureControl.classList.remove(
        this.styleNames.inPictureInPicture,
      );
      this._$togglePictureInPictureControl.setAttribute(
        'aria-label',
        this._textMap.get(TextLabel.ENTER_PICTURE_IN_PICTURE_LABEL),
      );
      this._tooltipReference.setText(
        this._textMap.get(TextLabel.ENTER_PICTURE_IN_PICTURE_TOOLTIP),
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

    this._$togglePictureInPictureControl = null;
    this._$rootElement = null;
  }
}

PictureInPictureView.setTheme(pictureInPictureViewTheme);
PictureInPictureView.extendStyleNames(styles);

export default PictureInPictureView;
