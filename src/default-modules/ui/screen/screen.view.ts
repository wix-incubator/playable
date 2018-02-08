import * as $ from 'jbone';

import View from '../core/view';
import { IView } from '../core/types';

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

  private _$node;
  private _$topBackground;
  private _$bottomBackground;

  constructor(config: IScreenViewConfig) {
    super();
    const { callbacks, nativeControls, playbackViewNode } = config;

    this._isNativeControls = nativeControls;
    this._callbacks = callbacks;
    this._$node = $('<div>', {
      class: this.styleNames.screen,
      'data-hook': 'screen-block',
    });

    this._bindEvents();

    this._$topBackground = $('<div>', {
      class: this.styleNames.screenTopBackground,
    });

    this._$bottomBackground = $('<div>', {
      class: this.styleNames.screenBottomBackground,
    });

    if (this._isNativeControls) {
      playbackViewNode.setAttribute('controls', 'true');
    }

    playbackViewNode.setAttribute('tabindex', String(-1));

    this._$node
      .append(playbackViewNode)
      .append(this._$topBackground)
      .append(this._$bottomBackground);
  }

  private _bindEvents() {
    this._$node[0].addEventListener(
      'click',
      this._callbacks.onWrapperMouseClick,
    );
    this._$node[0].addEventListener(
      'dblclick',
      this._callbacks.onWrapperMouseDblClick,
    );
  }

  private _unbindEvents() {
    this._$node[0].removeEventListener(
      'click',
      this._callbacks.onWrapperMouseClick,
    );
    this._$node[0].removeEventListener(
      'dblclick',
      this._callbacks.onWrapperMouseDblClick,
    );
  }

  focusOnNode() {
    this._$node[0].focus();
  }

  show() {
    this._$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this._$node.toggleClass(this.styleNames.hidden, true);
  }

  getNode() {
    return this._$node[0];
  }

  showTopShadow() {
    this._$topBackground.addClass(this.styleNames.visible);
  }

  hideTopShadow() {
    this._$topBackground.removeClass(this.styleNames.visible);
  }

  showBottomShadow() {
    if (!this._isNativeControls) {
      this._$bottomBackground.addClass(this.styleNames.visible);
    }
  }

  hideBottomShadow() {
    this._$bottomBackground.removeClass(this.styleNames.visible);
  }

  appendComponentNode(node) {
    this._$node.append(node);
  }

  destroy() {
    this._unbindEvents();
    this._$node.remove();

    delete this._$node;
  }
}

ScreenView.extendStyleNames(styles);

export default ScreenView;
