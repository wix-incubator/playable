import { thumbnailTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import {
  IPreviewService,
  INormalizedFramesQuality,
} from '../preview-service/types';

import { IPreviewThumbnail } from './types';

import styleNames from './preview-thumbnail.scss';

export default class PreviewThumbnail implements IPreviewThumbnail {
  static moduleName = 'previewThumbnail';
  static dependencies = ['previewService'];

  private _previewService: IPreviewService;

  private _currentFrames: INormalizedFramesQuality[];

  private _$rootElement: HTMLElement;
  private _$lowQualityThumb: HTMLElement;
  private _$highQualityThumb: HTMLElement;
  private _$timeText: HTMLDivElement;

  constructor({ previewService }: { previewService: IPreviewService }) {
    this._previewService = previewService;

    this._initUI();
  }

  private _initUI() {
    this._$rootElement = htmlToElement(
      thumbnailTemplate({
        styles: styleNames,
      }),
    );

    this._$timeText = getElementByHook(
      this._$rootElement,
      'playable-thumb-text-block',
    ) as HTMLDivElement;

    this._$lowQualityThumb = getElementByHook(
      this._$rootElement,
      'playable-thumb-low-quality',
    );
    this._$highQualityThumb = getElementByHook(
      this._$rootElement,
      'playable-thumb-high-quality',
    );
  }

  getDOMElement(): HTMLElement {
    return this._$rootElement;
  }

  showAt(second: number) {
    const config: INormalizedFramesQuality[] = this._previewService.getAt(
      second,
    );

    if (!config) {
      this._setEmpty();
      return;
    }

    this._unsetEmpty();

    if (this._currentFrames) {
      if (this._currentFrames[0].spriteUrl !== config[0].spriteUrl) {
        this._$lowQualityThumb.style.background = '';
      }
      if (this._currentFrames[1].spriteUrl !== config[1].spriteUrl) {
        this._$highQualityThumb.style.background = '';
      }
    }

    this._applyQualityToThumbElement(this._$lowQualityThumb, config[0]);
    this._applyQualityToThumbElement(this._$highQualityThumb, config[1]);

    this._currentFrames = config;
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

  private _setEmpty() {
    this._$rootElement.classList.add(styleNames.empty);
  }

  private _unsetEmpty() {
    this._$rootElement.classList.remove(styleNames.empty);
  }

  setTime(time: string) {
    this._$timeText.innerText = time;
  }

  destroy(): void {
    this._previewService = null;

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$timeText = null;
    this._$lowQualityThumb = null;
    this._$highQualityThumb = null;
    this._$rootElement = null;
  }
}
