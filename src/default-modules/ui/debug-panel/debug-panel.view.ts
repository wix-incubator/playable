import View from '../core/view';
import { IView } from '../core/types';

import { debugPanelTemplate } from './templates';

import syntaxHighlight from './syntaxHighlight';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleNodeClass from '../core/toggleNodeClass';

import {
  IDebugPanelViewStyles,
  IDebugPanelViewCallbacks,
  IDebugPanelViewConfig,
} from './types';

import styles from './debug-panel.scss';

class DebugPanelView extends View<IDebugPanelViewStyles>
  implements IView<IDebugPanelViewStyles> {
  private _callbacks: IDebugPanelViewCallbacks;

  private _$node: HTMLElement;
  private _$infoContainer: HTMLElement;
  private _$closeButton: HTMLElement;

  constructor(config: IDebugPanelViewConfig) {
    super();
    const { callbacks } = config;

    this._callbacks = callbacks;

    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$node = htmlToElement(
      debugPanelTemplate({
        styles: this.styleNames,
      }),
    );

    this._$closeButton = getElementByHook(
      this._$node,
      'debug-panel-close-button',
    );
    this._$infoContainer = getElementByHook(
      this._$node,
      'debug-panel-info-container',
    );
  }

  private _bindEvents() {
    this._$closeButton.addEventListener(
      'click',
      this._callbacks.onCloseButtonClick,
    );
  }

  private _unbindEvents() {
    this._$closeButton.removeEventListener(
      'click',
      this._callbacks.onCloseButtonClick,
    );
  }

  show() {
    toggleNodeClass(this._$node, this.styleNames.hidden, false);
  }

  hide() {
    toggleNodeClass(this._$node, this.styleNames.hidden, true);
  }

  setInfo(info) {
    this._$infoContainer.innerHTML = syntaxHighlight(
      JSON.stringify(info, undefined, 4),
      this.styleNames,
    );
  }

  getNode() {
    return this._$node;
  }

  destroy() {
    this._unbindEvents();

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
    delete this._$closeButton;
    delete this._$infoContainer;

    delete this._callbacks;
  }
}

DebugPanelView.extendStyleNames(styles);

export default DebugPanelView;
