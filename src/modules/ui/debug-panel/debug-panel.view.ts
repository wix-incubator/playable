import View from '../core/view';
import { IView } from '../core/types';

import { debugPanelTemplate } from './templates';

import syntaxHighlight from './syntaxHighlight';

import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';
import toggleElementClass from '../core/toggleElementClass';

import {
  IDebugPanelViewStyles,
  IDebugPanelViewCallbacks,
  IDebugPanelViewConfig,
} from './types';

import styles from './debug-panel.scss';

class DebugPanelView extends View<IDebugPanelViewStyles>
  implements IView<IDebugPanelViewStyles> {
  private _callbacks: IDebugPanelViewCallbacks;

  private _$rootElement: HTMLElement;
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
    this._$rootElement = htmlToElement(
      debugPanelTemplate({
        styles: this.styleNames,
      }),
    );

    this._$closeButton = getElementByHook(
      this._$rootElement,
      'playable-debug-panel-close-button',
    );
    this._$infoContainer = getElementByHook(
      this._$rootElement,
      'playable-debug-panel-info-container',
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
    toggleElementClass(this._$rootElement, this.styleNames.hidden, false);
  }

  hide() {
    toggleElementClass(this._$rootElement, this.styleNames.hidden, true);
  }

  setInfo(info: any) {
    this._$infoContainer.innerHTML = syntaxHighlight(
      JSON.stringify(info, undefined, 4),
      this.styleNames,
    );
  }

  getElement() {
    return this._$rootElement;
  }

  destroy() {
    this._unbindEvents();

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
    this._$closeButton = null;
    this._$infoContainer = null;

    this._callbacks = null;
  }
}

DebugPanelView.extendStyleNames(styles);

export default DebugPanelView;
