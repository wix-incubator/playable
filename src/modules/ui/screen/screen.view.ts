import View from '../core/view';
import { IView } from '../core/types';

import { screenTemplate } from './templates';

import htmlToElement from '../core/htmlToElement';
import toggleNodeClass from '../core/toggleNodeClass';

import { VideoViewMode } from '../../../constants';

import {
  VideoOrientation,
  IScreenViewStyles,
  IScreenViewCallbacks,
  IScreenViewConfig,
} from './types';

import styles from './screen.scss';

class ScreenView extends View<IScreenViewStyles>
  implements IView<IScreenViewStyles> {
  private _isNativeControls: boolean;
  private _callbacks: IScreenViewCallbacks;

  private _$node: HTMLElement;

  private _styleNamesByViewMode: { [key: string]: string };

  constructor(config: IScreenViewConfig) {
    super();
    const {
      callbacks,
      nativeControls,
      playbackViewNode,
      videoBackgroundNode,
    } = config;

    this._styleNamesByViewMode = {
      [VideoViewMode.REGULAR]: this.styleNames.regularMode,
      [VideoViewMode.BLUR]: this.styleNames.blurMode,
      [VideoViewMode.FILL]: this.styleNames.fillMode,
    };

    this._isNativeControls = nativeControls;
    this._callbacks = callbacks;

    this._initDOM({ playbackViewNode, videoBackgroundNode });
    this._bindEvents();
  }

  private _initDOM({ playbackViewNode, videoBackgroundNode }) {
    this._$node = htmlToElement(
      screenTemplate({
        styles: this.styleNames,
      }),
    );

    if (this._isNativeControls) {
      playbackViewNode.setAttribute('controls', 'true');
    }

    playbackViewNode.setAttribute('tabindex', '-1');

    this._$node.appendChild(videoBackgroundNode);
    this._$node.appendChild(playbackViewNode);
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

  setVideoOrientation(videoOrientation: VideoOrientation) {
    toggleNodeClass(
      this._$node,
      this.styleNames.horizontalVideo,
      videoOrientation !== VideoOrientation.PORTRAIT,
    );
    toggleNodeClass(
      this._$node,
      this.styleNames.verticalVideo,
      videoOrientation === VideoOrientation.PORTRAIT,
    );
  }

  setViewMode(viewMode: VideoViewMode) {
    if (this._styleNamesByViewMode[viewMode]) {
      Object.keys(this._styleNamesByViewMode).forEach(mode => {
        toggleNodeClass(this._$node, this._styleNamesByViewMode[mode], false);
      });

      toggleNodeClass(this._$node, this._styleNamesByViewMode[viewMode], true);
    }
  }

  destroy() {
    this._unbindEvents();
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    this._$node = null;
    this._callbacks = null;
  }
}

ScreenView.extendStyleNames(styles);

export default ScreenView;
