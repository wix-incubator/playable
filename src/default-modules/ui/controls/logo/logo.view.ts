import { TEXT_LABELS } from '../../../../constants/index';

import { ITooltipReference } from '../../core/tooltip';
import View from '../../core/view';
import { IView } from '../../core/types';
import { ILogoViewStyles, ILogoViewCallbacks, ILogoViewConfig } from './types';
import { logoTemplate } from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import * as styles from './logo.scss';

class LogoView extends View<ILogoViewStyles> implements IView<ILogoViewStyles> {
  private _tooltipReference: ITooltipReference;
  private _callbacks: ILogoViewCallbacks;
  private _textMap;

  private _$node: HTMLElement;
  private _$logo: HTMLElement;
  private _$placeholder: HTMLElement;

  constructor(config: ILogoViewConfig) {
    super();
    const { callbacks, textMap, tooltipService } = config;

    this._callbacks = callbacks;
    this._textMap = textMap;

    this._$node = htmlToElement(
      logoTemplate({
        styles: this.styleNames,
        texts: {
          label: this._textMap.get(TEXT_LABELS.LOGO_LABEL),
        },
      }),
    );

    this._$logo = getElementByHook(this._$node, 'company-logo');
    this._$placeholder = getElementByHook(this._$node, 'logo-placeholder');

    this._tooltipReference = tooltipService.createReference(this._$node, {
      text: this._textMap.get(TEXT_LABELS.LOGO_TOOLTIP),
    });

    this.setLogo(config.logo);

    this._bindCallbacks();
    this._bindEvents();
  }

  setLogo(url) {
    if (url) {
      this._$logo.classList.remove(this.styleNames.hidden);
      this._$placeholder.classList.add(this.styleNames.hidden);
      this._$logo.setAttribute('src', url);
    } else {
      this._$logo.classList.add(this.styleNames.hidden);
      this._$placeholder.classList.remove(this.styleNames.hidden);
      this._$logo.removeAttribute('src');
    }
  }

  setDisplayAsLink(flag) {
    if (flag) {
      this._$node.classList.add(this.styleNames.link);
    } else {
      this._$node.classList.remove(this.styleNames.link);
    }
  }

  _bindCallbacks() {
    this._onNodeClick = this._onNodeClick.bind(this);
  }

  _bindEvents() {
    this._$node.addEventListener('click', this._onNodeClick);
  }

  _unbindEvents() {
    this._$node.removeEventListener('click', this._onNodeClick);
  }

  _onNodeClick() {
    this._$node.focus();
    this._callbacks.onLogoClick();
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  getNode() {
    return this._$node;
  }

  destroy() {
    this._unbindEvents();
    this._tooltipReference.destroy();

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
    delete this._$logo;
    delete this._$placeholder;

    delete this._tooltipReference;
    delete this._textMap;
  }
}

LogoView.extendStyleNames(styles);

export default LogoView;
