import View from '../core/view';
import { IView } from '../core/types';

import { screenTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleNodeClass from '../core/toggleNodeClass';

import {
  VideoViewMode,
  IScreenViewStyles,
  IScreenViewCallbacks,
  IScreenViewConfig,
} from './types';

import styles from './screen.scss';

class ScreenView extends View<IScreenViewStyles>
  implements IView<IScreenViewStyles> {
  private _callbacks: IScreenViewCallbacks;

  private _$node: HTMLElement;
  private _$canvas: HTMLCanvasElement;
  private _$playbackNode: HTMLVideoElement;
  private _ctx: CanvasRenderingContext2D;

  private _widthHeightRatio: number;
  private _requestAnimationFrameID: number;
  private _currentMode: string;
  private _styleNamesByViewMode: any;

  constructor(config: IScreenViewConfig) {
    super();
    const { callbacks, nativeControls, playbackViewNode } = config;

    this._callbacks = callbacks;

    this._styleNamesByViewMode = {
      [VideoViewMode.REGULAR]: this.styleNames.regularMode,
      [VideoViewMode.BLUR]: this.styleNames.blurMode,
      [VideoViewMode.FILL]: this.styleNames.fillMode,
    };

    this._bindCallbacks();

    if (nativeControls) {
      playbackViewNode.setAttribute('controls', 'true');
    }

    this._initDOM(playbackViewNode);
    this._bindEvents();
    this.setViewMode(VideoViewMode.REGULAR);
  }

  private _bindCallbacks() {
    this._updateBackground = this._updateBackground.bind(this);
  }

  private _initDOM(playbackViewNode: HTMLElement) {
    this._$node = htmlToElement(
      screenTemplate({
        styles: this.styleNames,
      }),
    );

    this._$playbackNode = playbackViewNode as HTMLVideoElement;
    this._$node.appendChild(playbackViewNode);

    this._$canvas = getElementByHook(
      this._$node,
      'background-canvas',
    ) as HTMLCanvasElement;
    this._ctx = this._$canvas.getContext('2d');
  }

  private _bindEvents() {
    this._$node.addEventListener('click', this._callbacks.onWrapperMouseClick);
    this._$node.addEventListener(
      'dblclick',
      this._callbacks.onWrapperMouseDblClick,
    );
  }

  private _unbindEvents() {
    this._$node.removeEventListener(
      'click',
      this._callbacks.onWrapperMouseClick,
    );
    this._$node.removeEventListener(
      'dblclick',
      this._callbacks.onWrapperMouseDblClick,
    );
  }

  updateVideoAspectRatio(widthHeightRatio: number) {
    this._widthHeightRatio = widthHeightRatio;
    const isHorizontal = this._widthHeightRatio > 1;
    toggleNodeClass(this._$node, this.styleNames.horizontalVideo, isHorizontal);
    toggleNodeClass(this._$node, this.styleNames.verticalVideo, !isHorizontal);
  }

  focusOnNode() {
    this._$node.focus();
  }

  show() {
    toggleNodeClass(this._$node, this.styleNames.hidden, false);
  }

  hide() {
    toggleNodeClass(this._$node, this.styleNames.hidden, true);
  }

  getNode() {
    return this._$node;
  }

  appendComponentNode(node: HTMLElement) {
    this._$node.appendChild(node);
  }

  hideCursor() {
    toggleNodeClass(this._$node, this.styleNames.hiddenCursor, true);
  }

  showCursor() {
    toggleNodeClass(this._$node, this.styleNames.hiddenCursor, false);
  }

  setViewMode(viewMode: VideoViewMode) {
    if (this._styleNamesByViewMode[viewMode]) {
      this.resetBackground();

      Object.keys(this._styleNamesByViewMode).forEach(mode => {
        toggleNodeClass(this._$node, this._styleNamesByViewMode[mode], false);
      });

      toggleNodeClass(this._$node, this._styleNamesByViewMode[viewMode], true);

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
    const { videoWidth, videoHeight } = this._$playbackNode;
    this._widthHeightRatio = videoHeight ? videoWidth / videoHeight : 0;
    const isHorizontal = this._widthHeightRatio > 1;
    toggleNodeClass(this._$node, this.styleNames.horizontalVideo, isHorizontal);
    toggleNodeClass(this._$node, this.styleNames.verticalVideo, !isHorizontal);
  }

  resetBackground() {
    if (this._currentMode === VideoViewMode.BLUR) {
      this._clearBackground();
    }
  }

  private _getSourceAreas(width: number, height: number): number[][] {
    if (this._widthHeightRatio > 1) {
      return [[0, 0, width, 1], [0, height - 1, width, 1]];
    }

    return [[0, 0, 1, height], [width - 1, 0, 1, height]];
  }

  private _getCanvasAreas(width: number, height: number): number[][] {
    if (this._widthHeightRatio > 1) {
      return [[0, 0, width, height / 2], [0, height / 2, width, height / 2]];
    }

    return [[0, 0, width / 2, height], [width / 2, 0, width / 2, height]];
  }

  private _drawAreaFromSource(source: number[], area: number[]) {
    const [sourceX, sourceY, sourceWidth, sourceHeight] = source;
    const [areaX, areaY, areaWidth, areaHeight] = area;

    this._ctx.drawImage(
      this._$playbackNode,

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
    const { videoWidth, videoHeight } = this._$playbackNode;
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
    this._ctx.clearRect(0, 0, this._$canvas.width, this._$canvas.height);
  }

  destroy() {
    this._stopUpdatingBackground();
    this._unbindEvents();
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    this._$node = null;
    this._$playbackNode = null;
    this._$canvas = null;
    this._ctx = null;

    this._callbacks = null;
  }
}

ScreenView.extendStyleNames(styles);

export default ScreenView;
