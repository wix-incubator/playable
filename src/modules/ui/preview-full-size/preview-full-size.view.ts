import View from '../core/view';
import { IView } from '../core/types';

import { previewTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import { INormalizedFramesQuality } from '../preview-service/types';

import { IPreviewFullSizeViewStyles } from './types';

import styles from './preview-full-size.scss';

class PreviewFullSizeView extends View<IPreviewFullSizeViewStyles>
  implements IView<IPreviewFullSizeViewStyles> {
  private _$rootElement: HTMLElement;
  private _$frame: HTMLElement;

  constructor() {
    super();

    this._initDOM();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      previewTemplate({
        styles: this.styleNames,
      }),
    );

    this._$frame = getElementByHook(
      this._$rootElement,
      'preview-full-size-frame',
    ) as HTMLDivElement;
  }

  getElement(): HTMLElement {
    return this._$rootElement;
  }

  setPreview(data: INormalizedFramesQuality) {
    this._applyFrame(data);
  }

  private _applyFrame(frameData: INormalizedFramesQuality) {
    const viewWidth = this._$frame.offsetWidth;
    const viewHeight = this._$frame.offsetHeight;

    const backgroudWidth = viewWidth * frameData.framesInSprite.horz;
    const backgroundHeight = viewHeight * frameData.framesInSprite.vert;

    this._$frame.style.background = `url('${
      frameData.spriteUrl
    }') -${viewWidth * frameData.framePositionInSprite.horz}px -${viewHeight *
      frameData.framePositionInSprite
        .vert}px / ${backgroudWidth}px ${backgroundHeight}px`;
  }

  clear() {
    this._$frame.style.background = '';
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  destroy(): void {
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$frame = null;
    this._$rootElement = null;
  }
}

PreviewFullSizeView.extendStyleNames(styles);

export default PreviewFullSizeView;
