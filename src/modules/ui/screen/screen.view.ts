import View from '../core/view';
import { IView } from '../core/types';

import { screenTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleNodeClass from '../core/toggleNodeClass';

import {
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

  constructor(config: IScreenViewConfig) {
    super();
    const { callbacks, nativeControls, playbackViewNode } = config;

    this._isNativeControls = nativeControls;
    this._callbacks = callbacks;

    this._bindCallbacks();
    this._initDOM(playbackViewNode);
    this._bindEvents();
    this.updateVideoAspectRatio(2);
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

    playbackViewNode.setAttribute('tabindex', String(-1));

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
    if (this._widthHeightRatio > 1) {
      toggleNodeClass(this._$node, this.styleNames.horizontalVideo, true);
      toggleNodeClass(this._$node, this.styleNames.verticalVideo, false);
    } else {
      toggleNodeClass(this._$node, this.styleNames.horizontalVideo, false);
      toggleNodeClass(this._$node, this.styleNames.verticalVideo, true);
    }
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
    this._$node.classList.add(this.styleNames.hiddenCursor);
  }

  showCursor() {
    this._$node.classList.remove(this.styleNames.hiddenCursor);
  }

  setCanvasWidth(width: number) {
    this._$canvas.width = width + 2 * CANVAS_BACKGROUND_PADDING_HORIZONTAL;
  }

  setCanvasHeight(height: number) {
    this._$canvas.height = height + 2 * CANVAS_BACKGROUND_PADDING_VERTICAL;
  }

  startUpdatingBackground() {
    this._updateBackground();
  }

  stopUpdatingBackground() {
    cancelAnimationFrame(this._requestAnimationFrameID);
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

  destroy() {
    this.stopUpdatingBackground();
    this._unbindEvents();
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;

    delete this._callbacks;
  }
}

ScreenView.extendStyleNames(styles);

export default ScreenView;
