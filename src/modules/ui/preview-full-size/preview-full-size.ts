import {
  IPreviewService,
  INormalizedFramesQuality,
} from '../preview-service/types';
import { IRootContainer } from '../../root-container/types';

import { IPreviewFullSize } from './types';

import PreviewFullsizeView from './preview-full-size.view';

export default class PreviewFullsize implements IPreviewFullSize {
  static moduleName = 'previewFullSize';
  static View = PreviewFullsizeView;
  static dependencies = ['previewService', 'rootContainer'];

  private _previewService: IPreviewService;

  private _currentFrame: INormalizedFramesQuality;

  view: PreviewFullsizeView;

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
    rootContainer.appendComponentElement(this.getElement());
  }

  private _initUI() {
    this.view = new PreviewFullsize.View();
  }

  getElement(): HTMLElement {
    return this.view.getElement();
  }

  showAt(second: number) {
    this.view.show();
    const framesData: INormalizedFramesQuality[] = this._previewService.getAt(
      second,
    );

    if (!framesData) {
      this.view.clear();
      return;
    }

    const frameData = framesData.pop();

    if (this._currentFrame) {
      if (this._currentFrame.spriteUrl !== frameData.spriteUrl) {
        this.view.clear();
      }
    }

    this.view.setPreview(frameData);

    this._currentFrame = frameData;
  }

  hide() {
    this.view.hide();
  }

  destroy(): void {
    this._previewService = null;

    this.view.destroy();
    this.view = null;
  }
}
