import View from '../core/view';
import { IView } from '../core/types';

import { screenTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleNodeClass from '../core/toggleNodeClass';

import {
  ViewMode,
  IScreenViewStyles,
  IScreenViewCallbacks,
  IScreenViewConfig,
} from './types';

import styles from './screen.scss';


const CANVAS_BACKGROUND_PADDING_VERTICAL = 20;
const CANVAS_BACKGROUND_PADDING_HORIZONTAL = 20;

class ScreenView extends View<IScreenViewStyles>
  implements IView<IScreenViewStyles> {
  private _isNativeControls: boolean;
  private _callbacks: IScreenViewCallbacks;

  private _$node: HTMLElement;
  private _$canvas: HTMLCanvasElement;
  private _$playbackNode: HTMLVideoElement;
  private _ctx: CanvasRenderingContext2D;

  private _widthHeightRatio: number;
  private _requestAnimationFrameID: number;
  private _currentMode: string;
  private _viewModeStyleNames: any;

  constructor(config: IScreenViewConfig) {
    super();
    const { callbacks, nativeControls, playbackViewNode } = config;

    this._isNativeControls = nativeControls;
    this._callbacks = callbacks;

    this._viewModeStyleNames = {
      [ViewMode.REGULAR]: this.styleNames.regularMode,
      [ViewMode.BLUR]: this.styleNames.blurMode,
      [ViewMode.FILL]: this.styleNames.fillMode,
    };

    this._bindCallbacks();
    this._initDOM(playbackViewNode);
    this._bindEvents();
    this.setViewMode(ViewMode.REGULAR);
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

    if (this._isNativeControls) {
      playbackViewNode.setAttribute('controls', 'true');
    }

    playbackViewNode.setAttribute('tabindex', '-1');

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

  updateVideoAspectRatio(widthHeightRatio) {
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

  appendComponentNode(node) {
    this._$node.appendChild(node);
  }

  hideCursor() {
    toggleNodeClass(this._$node, this.styleNames.hiddenCursor, true);
  }

  showCursor() {
    toggleNodeClass(this._$node, this.styleNames.hiddenCursor, false);
  }

  setViewMode(viewMode: ViewMode) {
    if (this._viewModeStyleNames[viewMode]) {
      this.reset();

      Object.keys(this._viewModeStyleNames).forEach(mode => {
        toggleNodeClass(this._$node, this.styleNames[this._viewModeStyleNames[mode]], false);
      });

      toggleNodeClass(this._$node, this.styleNames[this._viewModeStyleNames[viewMode]], true);

      if (viewMode === ViewMode.BLUR) {
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
    this._$canvas.width = width + 2 * CANVAS_BACKGROUND_PADDING_HORIZONTAL;
  }

  setBackgroundHeight(height: number) {
    this._$canvas.height = height + 2 * CANVAS_BACKGROUND_PADDING_VERTICAL;
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

  reset() {
    if (this._currentMode === ViewMode.BLUR) {
      this._clearBackground();
    }
  }

  private _updatePortraitBackground() {
    const { videoWidth, videoHeight } = this._$playbackNode;
    const canvasWidth = this._$canvas.width;
    const canvasHeight = this._$canvas.height;

    this._ctx.drawImage(this._$playbackNode, 0, 0, canvasWidth, canvasHeight);
    this._ctx.drawImage(
      this._$playbackNode,
      0,
      0,
      1,
      videoHeight,
      CANVAS_BACKGROUND_PADDING_HORIZONTAL,
      CANVAS_BACKGROUND_PADDING_VERTICAL,
      canvasWidth / 2 - CANVAS_BACKGROUND_PADDING_HORIZONTAL,
      canvasHeight - 2 * CANVAS_BACKGROUND_PADDING_VERTICAL,
    );
    this._ctx.drawImage(
      this._$playbackNode,
      videoWidth - 1,
      0,
      1,
      videoHeight,
      canvasWidth / 2,
      CANVAS_BACKGROUND_PADDING_VERTICAL,
      canvasWidth / 2 - CANVAS_BACKGROUND_PADDING_HORIZONTAL,
      canvasHeight - 2 * CANVAS_BACKGROUND_PADDING_VERTICAL,
    );

    this._requestAnimationFrameID = requestAnimationFrame(
      this._updateBackground,
    );
  }

  private _updateLandscapeBackground() {
    const { videoWidth, videoHeight } = this._$playbackNode;
    const canvasWidth = this._$canvas.width;
    const canvasHeight = this._$canvas.height;

    this._ctx.drawImage(this._$playbackNode, 0, 0, canvasWidth, canvasHeight);
    this._ctx.drawImage(
      this._$playbackNode,
      0,
      0,
      videoWidth,
      1,
      CANVAS_BACKGROUND_PADDING_HORIZONTAL,
      CANVAS_BACKGROUND_PADDING_VERTICAL,
      canvasWidth - 2 * CANVAS_BACKGROUND_PADDING_HORIZONTAL,
      canvasHeight / 2 - CANVAS_BACKGROUND_PADDING_VERTICAL,
    );
    this._ctx.drawImage(
      this._$playbackNode,
      0,
      videoHeight - 1,
      videoWidth,
      1,
      CANVAS_BACKGROUND_PADDING_HORIZONTAL,
      canvasHeight / 2,
      canvasWidth - 2 * CANVAS_BACKGROUND_PADDING_HORIZONTAL,
      canvasHeight / 2 - CANVAS_BACKGROUND_PADDING_VERTICAL,
    );

    this._requestAnimationFrameID = requestAnimationFrame(
      this._updateBackground,
    );
  }

  private _updateBackground() {
    if (this._widthHeightRatio > 1) {
      this._updateLandscapeBackground();
    } else {
      this._updatePortraitBackground();
    }
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
