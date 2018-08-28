import { previewTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import {
  IPreviewService,
  INormalizedFramesQuality,
} from '../preview-service/types';
import { IRootContainer } from '../../root-container/types';

import { IPreviewFullSize } from './types';

import styleNames from './preview-full-size.scss';

export default class PreviewFullsize implements IPreviewFullSize {
  static moduleName = 'previewFullSize';
  static dependencies = ['previewService', 'rootContainer'];

  private _previewService: IPreviewService;

  private _currentFrame: INormalizedFramesQuality;

  private _$rootElement: HTMLElement;
  private _$frame: HTMLElement;

  constructor({
    previewService,
    rootContainer,
  }: {
    previewService: IPreviewService;
    rootContainer: IRootContainer;
  }) {
    this._previewService = previewService;

    this._initUI();

    this.hide();
    rootContainer.appendComponentNode(this.getElement());
  }

  private _initUI() {
    this._$rootElement = htmlToElement(
      previewTemplate({
        styles: styleNames,
      }),
    );

    this._$frame = getElementByHook(
      this._$rootElement,
      'playable-preview-full-size-frame',
    ) as HTMLDivElement;
  }

  getElement(): HTMLElement {
    return this._$rootElement;
  }

  showAt(second: number) {
    this._showFrame();
    const config: INormalizedFramesQuality[] = this._previewService.getAt(
      second,
    );

    if (!config) {
      this._clearFrame();
      return;
    }

    const frameData = config.pop();

    if (this._currentFrame) {
      if (this._currentFrame.spriteUrl !== frameData.spriteUrl) {
        this._$frame.style.background = '';
      }
    }

    this._applyFrame(frameData);

    this._currentFrame = frameData;
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

  private _clearFrame() {
    this._$frame.style.background = '';
  }

  private _showFrame() {
    this._$rootElement.classList.remove(styleNames.hidden);
  }

  private _hideFrame() {
    this._$rootElement.classList.add(styleNames.hidden);
  }

  hide() {
    this._hideFrame();
  }

  destroy(): void {
    this._previewService = null;

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$frame = null;
    this._$rootElement = null;
  }
}
