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

import * as styles from './screen.scss';

class ScreenView extends View<IScreenViewStyles>
  implements IView<IScreenViewStyles> {
  private _isNativeControls: boolean;
  private _callbacks: IScreenViewCallbacks;

  private _$node: HTMLElement;
  private _$topBackground: HTMLElement;
  private _$bottomBackground: HTMLElement;

  constructor(config: IScreenViewConfig) {
    super();
    const { callbacks, nativeControls, playbackViewNode } = config;

    this._isNativeControls = nativeControls;
    this._callbacks = callbacks;

    this._initDOM(playbackViewNode);
    this._bindEvents();
  }

  private _initDOM(playbackViewNode: HTMLElement) {
    this._$node = htmlToElement(
      screenTemplate({
        styles: this.styleNames,
      }),
    );

    this._$topBackground = getElementByHook(
      this._$node,
      'screen-top-background',
    );
    this._$bottomBackground = getElementByHook(
      this._$node,
      'screen-bottom-background',
    );

    if (this._isNativeControls) {
      playbackViewNode.setAttribute('controls', 'true');
    }

    playbackViewNode.setAttribute('tabindex', String(-1));

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

  showTopShadow() {
    this._$topBackground.classList.add(this.styleNames.visible);
  }

  hideTopShadow() {
    this._$topBackground.classList.remove(this.styleNames.visible);
  }

  showBottomShadow() {
    if (!this._isNativeControls) {
      this._$bottomBackground.classList.add(this.styleNames.visible);
    }
  }

  hideBottomShadow() {
    this._$bottomBackground.classList.remove(this.styleNames.visible);
  }

  appendComponentNode(node) {
    this._$node.appendChild(node);
  }

  destroy() {
    this._unbindEvents();
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
    delete this._$topBackground;
    delete this._$bottomBackground;

    delete this._callbacks;
  }
}

ScreenView.extendStyleNames(styles);

export default ScreenView;
