import PreviewThumbnailView from './preview-thumbnail.view';

import {
  IPreviewService,
  INormalizedFramesQuality,
} from '../preview-service/types';

import { IPreviewThumbnail } from './types';

export default class PreviewThumbnail implements IPreviewThumbnail {
  static moduleName = 'previewThumbnail';
  static View = PreviewThumbnailView;
  static dependencies = ['previewService'];

  private _previewService: IPreviewService;

  private _currentFrames: INormalizedFramesQuality[];

  view: PreviewThumbnailView;

  constructor({ previewService }: { previewService: IPreviewService }) {
    this._previewService = previewService;

    this._initUI();
  }

  private _initUI() {
    this.view = new PreviewThumbnail.View();
  }

  getElement(): HTMLElement {
    return this.view.getElement();
  }

  showAt(second: number) {
    const config: INormalizedFramesQuality[] = this._previewService.getAt(
      second,
    );

    if (!config) {
      this.view.showAsEmpty();
      return;
    }

    this.view.showWithPreview();

    if (this._currentFrames) {
      if (this._currentFrames[0].spriteUrl !== config[0].spriteUrl) {
        this.view.clearLowQualityPreview();
      }
      if (this._currentFrames[1].spriteUrl !== config[1].spriteUrl) {
        this.view.clearHighQualityPreview();
      }
    }

    this.view.setLowQualityPreview(config[0]);
    this.view.setHighQualityPreview(config[1]);

    this._currentFrames = config;
  }

  setTime(time: string) {
    this.view.setTime(time);
  }

  destroy(): void {
    this._previewService = null;

    this.view.destroy();
    this.view = null;
  }
}
