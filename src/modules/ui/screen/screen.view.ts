import View from '../core/view';
import { IView } from '../core/types';

import { screenTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleElementClass from '../core/toggleElementClass';

import { VideoViewMode, IScreenViewStyles, IScreenViewConfig } from './types';

import styles from './screen.scss';

class ScreenView extends View<IScreenViewStyles>
  implements IView<IScreenViewStyles> {
  private _$rootElement: HTMLElement;
  private _$canvas: HTMLCanvasElement;
  private _$playbackElement: HTMLVideoElement;

  private _isHorizontalStripes: boolean;

  private _requestAnimationFrameID: number;
  private _currentMode: string;
  private _styleNamesByViewMode: {
    [viewMode: string]: string;
  };

  constructor(config: IScreenViewConfig) {
    super();
    const { nativeControls, playbackViewElement } = config;

    this._styleNamesByViewMode = {
      [VideoViewMode.REGULAR]: this.styleNames.regularMode,
      [VideoViewMode.BLUR]: this.styleNames.blurMode,
      [VideoViewMode.FILL]: this.styleNames.fillMode,
    };

    this._bindCallbacks();

    if (nativeControls) {
      playbackViewElement.setAttribute('controls', 'true');
    }

    this._initDOM(playbackViewElement);
    this.setViewMode(VideoViewMode.REGULAR);
  }

  private _bindCallbacks() {
    this._updateBackground = this._updateBackground.bind(this);
  }

  private _initDOM(playbackViewElement: HTMLElement) {
    this._$rootElement = htmlToElement(
      screenTemplate({
        styles: this.styleNames,
      }),
    );

    this._$playbackElement = playbackViewElement as HTMLVideoElement;
    this._$rootElement.appendChild(playbackViewElement);

    this._$canvas = getElementByHook(
      this._$rootElement,
      'background-canvas',
    ) as HTMLCanvasElement;
  }

  show() {
    toggleElementClass(this._$rootElement, this.styleNames.hidden, false);
  }

  hide() {
    toggleElementClass(this._$rootElement, this.styleNames.hidden, true);
  }

  getElement() {
    return this._$rootElement;
  }

  setViewMode(viewMode: VideoViewMode) {
    if (this._styleNamesByViewMode[viewMode]) {
      this.resetBackground();

      Object.keys(this._styleNamesByViewMode).forEach(mode => {
        toggleElementClass(
          this._$rootElement,
          this._styleNamesByViewMode[mode],
          false,
        );
      });

      toggleElementClass(
        this._$rootElement,
        this._styleNamesByViewMode[viewMode],
        true,
      );

      if (viewMode === VideoViewMode.BLUR) {
        this._startUpdatingBackground();
      } else {
        this._stopUpdatingBackground();
      }

      this._currentMode = viewMode;
    }
  }

  setBackgroundSize(width: number, height: number) {
    this.setBackgroundWidth(width);
    this.setBackgroundHeight(height);
  }

  setBackgroundWidth(width: number) {
    this._$canvas.width = width;
  }

  setBackgroundHeight(height: number) {
    this._$canvas.height = height;
  }

  private _startUpdatingBackground() {
    if (!this._requestAnimationFrameID) {
      this._updateBackground();
    }
  }

  private _stopUpdatingBackground() {
    if (this._requestAnimationFrameID) {
      cancelAnimationFrame(this._requestAnimationFrameID);
      this._requestAnimationFrameID = null;
    }
  }

  resetAspectRatio() {
    const { videoWidth, videoHeight } = this._$playbackElement;
    const { width, height } = this._$rootElement.getBoundingClientRect();
    this._isHorizontalStripes =
      width / height < (videoHeight ? videoWidth / videoHeight : 0);

    toggleElementClass(
      this._$rootElement,
      this.styleNames.horizontalStripes,
      this._isHorizontalStripes,
    );
    toggleElementClass(
      this._$rootElement,
      this.styleNames.verticalStripes,
      !this._isHorizontalStripes,
    );
  }

  resetBackground() {
    if (this._currentMode === VideoViewMode.BLUR) {
      this._clearBackground();
    }
  }

  private _getSourceAreas(width: number, height: number): number[][] {
    if (this._isHorizontalStripes) {
      return [
        [0, 0, width, 1],
        [0, height - 1, width, 1],
      ];
    }

    return [
      [0, 0, 1, height],
      [width - 1, 0, 1, height],
    ];
  }

  private _getCanvasAreas(width: number, height: number): number[][] {
    if (this._isHorizontalStripes) {
      return [
        [0, 0, width, height / 2],
        [0, height / 2, width, height / 2],
      ];
    }

    return [
      [0, 0, width / 2, height],
      [width / 2, 0, width / 2, height],
    ];
  }

  private _drawAreaFromSource(source: number[], area: number[]) {
    const [sourceX, sourceY, sourceWidth, sourceHeight] = source;
    const [areaX, areaY, areaWidth, areaHeight] = area;
    const ctx = this._$canvas.getContext('2d');

    ctx.drawImage(
      this._$playbackElement,

      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,

      areaX,
      areaY,
      areaWidth,
      areaHeight,
    );
  }
  private _drawBackground() {
    const { videoWidth, videoHeight } = this._$playbackElement;
    const canvasWidth: number = this._$canvas.width;
    const canvasHeight: number = this._$canvas.height;
    const sourceAreas: number[][] = this._getSourceAreas(
      videoWidth,
      videoHeight,
    );
    const canvasAreas: number[][] = this._getCanvasAreas(
      canvasWidth,
      canvasHeight,
    );

    this._drawAreaFromSource(sourceAreas[0], canvasAreas[0]);
    this._drawAreaFromSource(sourceAreas[1], canvasAreas[1]);
  }

  private _updateBackground() {
    this._drawBackground();

    this._requestAnimationFrameID = requestAnimationFrame(
      this._updateBackground,
    );
  }

  private _clearBackground() {
    const ctx = this._$canvas.getContext('2d');

    ctx.clearRect(0, 0, this._$canvas.width, this._$canvas.height);
  }

  destroy() {
    this._stopUpdatingBackground();
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
    this._$playbackElement = null;
    this._$canvas = null;
  }
}

ScreenView.extendStyleNames(styles);

export default ScreenView;
