import View from '../core/view';
import { IView } from '../core/types';

import { thumbnailTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import { INormalizedFramesQuality } from '../preview-service/types';

import { IPreviewThumbnailViewStyles } from './types';

import styles from './preview-thumbnail.scss';

class PreviewThumbnailView extends View<IPreviewThumbnailViewStyles>
  implements IView<IPreviewThumbnailViewStyles> {
  private _$rootElement: HTMLElement;
  private _$lowQualityThumb: HTMLElement;
  private _$highQualityThumb: HTMLElement;
  private _$timeText: HTMLDivElement;

  constructor() {
    super();

    this._initDOM();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      thumbnailTemplate({
        styles: this.styleNames,
      }),
    );

    this._$timeText = getElementByHook(
      this._$rootElement,
      'thumb-text-block',
    ) as HTMLDivElement;

    this._$lowQualityThumb = getElementByHook(
      this._$rootElement,
      'thumb-low-quality',
    );
    this._$highQualityThumb = getElementByHook(
      this._$rootElement,
      'thumb-high-quality',
    );
  }

  getElement(): HTMLElement {
    return this._$rootElement;
  }

  showAsEmpty() {
    this._$rootElement.classList.add(this.styleNames.empty);
  }

  showWithPreview() {
    this._$rootElement.classList.remove(this.styleNames.empty);
  }

  clearLowQualityPreview() {
    this._$lowQualityThumb.style.background = '';
  }

  clearHighQualityPreview() {
    this._$highQualityThumb.style.background = '';
  }

  setLowQualityPreview(qualityData: INormalizedFramesQuality) {
    this._applyQualityToThumbElement(this._$lowQualityThumb, qualityData);
  }

  setHighQualityPreview(qualityData: INormalizedFramesQuality) {
    this._applyQualityToThumbElement(this._$highQualityThumb, qualityData);
  }

  private _applyQualityToThumbElement(
    element: HTMLElement,
    quality: INormalizedFramesQuality,
  ) {
    const viewWidth = element.offsetWidth;
    const viewHeight = element.offsetHeight;

    const backgroudWidth = viewWidth * quality.framesInSprite.horz;
    const backgroundHeight = viewHeight * quality.framesInSprite.vert;

    element.style.background = `url('${quality.spriteUrl}') -${viewWidth *
      quality.framePositionInSprite.horz}px -${viewHeight *
      quality.framePositionInSprite
        .vert}px / ${backgroudWidth}px ${backgroundHeight}px`;
  }

  setTime(time: string) {
    this._$timeText.innerText = time;
  }

  destroy(): void {
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$timeText = null;
    this._$lowQualityThumb = null;
    this._$highQualityThumb = null;
    this._$rootElement = null;
  }
}

PreviewThumbnailView.extendStyleNames(styles);

export default PreviewThumbnailView;
