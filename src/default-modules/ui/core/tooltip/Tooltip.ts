import * as Popper from '@bodia_uz/popper.js/dist/umd/popper-lite';
import createTooltipNode, {
  ITooltipStyles,
  TOOLTIP_INNER_HOOK,
} from './createTooltipNode';
import Stylable from '../stylable';
import getElementByHook from '../getElementByHook';

import * as styles from './tooltip.scss';

type ITooltipOptions = {
  title?: string;
  placement?: string;
  popperOptions?: any;
  container?: boolean | string | HTMLElement;
  boundariesElement?: HTMLElement;
  eventsEnabled?: boolean;
  delay?: number | any;
};

interface ITooltip {
  show(): void;
  hide(): void;
  setTitle(title: string): void;
  destroy(): void;
}

const SHOW_EVENTS = ['mouseenter', 'focus'];
const HIDE_EVENTS = ['mouseleave', 'blur'];

class Tooltip extends Stylable<ITooltipStyles> implements ITooltip {
  private _reference: HTMLElement;
  private _tooltipNode: HTMLElement;
  private _tooltipInnerNode: HTMLElement;

  private _options: ITooltipOptions;

  private _isOpen: boolean;
  private _isOpening: boolean;

  private _eventListeners: any[];
  private _showTimeout: number;

  popperInstance: Popper;

  constructor(reference: HTMLElement, options?: ITooltipOptions) {
    super();

    this._reference = reference;
    this._options = {
      placement: 'top',
      eventsEnabled: false,
      ...options,
    };

    this._eventListeners = [];
    this._isOpen = false;
    this._isOpening = false;

    this._bindEvents();
  }

  show() {
    this._show();
  }

  hide() {
    this._hide();
  }

  setTitle(title: string) {
    this._options.title = title;

    if (this._tooltipNode) {
      this._tooltipInnerNode.textContent = title;
      this.popperInstance.update();
    }
  }

  destroy() {
    this._eventListeners.forEach(({ event, fn }) => {
      this._reference.removeEventListener(event, fn);
    });
    this._eventListeners = [];

    if (this._tooltipNode) {
      this._hide();

      this.popperInstance.destroy();

      // destroy tooltipNode if removeOnDestroy is not set, as popperInstance.destroy() already removes the element
      if (!this.popperInstance.options.removeOnDestroy) {
        this._tooltipNode.parentNode.removeChild(this._tooltipNode);
        this._tooltipNode = null;
      }
    }
  }

  private _bindEvents() {
    SHOW_EVENTS.forEach(event => {
      const fn = () => {
        if (this._isOpening) {
          return;
        }
        this._scheduleShow();
      };
      this._eventListeners.push({ event, fn });
      this._reference.addEventListener(event, fn);
    });

    HIDE_EVENTS.forEach(event => {
      const fn = e => {
        this._scheduleHide(e);
      };
      this._eventListeners.push({ event, fn });
      this._reference.addEventListener(event, fn);
    });
  }

  private _scheduleShow() {
    const delay = this._options.delay;
    const computedDelay = (delay && delay.show) || delay || 0;

    this._isOpening = true;
    this._showTimeout = setTimeout(() => this._show(), computedDelay);
  }

  private _scheduleHide(e) {
    const delay = this._options.delay;
    const computedDelay = (delay && delay.hide) || delay || 0;

    this._isOpening = false;

    setTimeout(() => {
      clearTimeout(this._showTimeout);

      if (
        this._isOpen === false ||
        !document.body.contains(this._tooltipNode)
      ) {
        return;
      }

      // if we are hiding because of a mouseleave, we must check that the new
      // reference isn't the tooltip, because in this case we don't want to hide it
      if (e.type === 'mouseleave') {
        const isSet = this._setTooltipNodeEvent(e);

        // if we set the new event, don't hide the tooltip yet
        // the new event will take care to hide it if necessary
        if (isSet) {
          return;
        }
      }

      this._hide();
    }, computedDelay);
  }

  private _show() {
    if (this._isOpen && !this._isOpening) {
      return;
    }

    this._isOpen = true;

    if (!this._tooltipNode) {
      this._initTooltip();
      this._initPopper();
      return;
    }

    this._tooltipNode.classList.remove(this.styleNames.tooltipHidden);
    this._tooltipNode.setAttribute('aria-hidden', 'false');
    this.popperInstance.update();
  }

  private _hide() {
    if (!this._isOpen) {
      return;
    }

    this._isOpen = false;
    this._tooltipNode.classList.add(this.styleNames.tooltipHidden);
    this._tooltipNode.setAttribute('aria-hidden', 'true');
  }

  private _setTooltipNodeEvent(e) {
    const reference = this._reference;
    const relatedReference =
      e.relatedreference || e.toElement || e.relatedTarget;

    const callback = e2 => {
      const relatedReference2 =
        e2.relatedreference || e2.toElement || e2.relatedTarget;

      this._tooltipNode.removeEventListener('mouseleave', callback);

      if (!reference.contains(relatedReference2)) {
        // If the new reference is not the reference element
        // Schedule to hide tooltip
        this._scheduleHide(e2);
      }
    };

    if (this._tooltipNode.contains(relatedReference)) {
      this._tooltipNode.addEventListener('mouseleave', callback);
      return true;
    }

    return false;
  }

  private _initTooltip() {
    const reference = this._reference;
    const options = this._options;

    const tooltipContainer = this._getTooltipContainer();
    const tooltipNode = createTooltipNode({
      title: options.title,
      styles: this.styleNames,
    });

    // add accessibility attributes
    tooltipNode.id = this._createTooltipId();
    tooltipNode.setAttribute('aria-hidden', 'false');
    reference.setAttribute('aria-describedby', tooltipNode.id);

    tooltipContainer.appendChild(tooltipNode);

    this._tooltipNode = tooltipNode;
    this._tooltipInnerNode = getElementByHook(tooltipNode, TOOLTIP_INNER_HOOK);
  }

  private _initPopper() {
    const options = this._options;
    const popperOptions = {
      ...options.popperOptions,
      placement: options.placement,
      eventsEnabled: options.eventsEnabled,
    };

    popperOptions.modifiers = popperOptions.modifiers || {};

    if (options.boundariesElement) {
      popperOptions.modifiers.preventOverflow = {
        boundariesElement: options.boundariesElement,
      };
    }

    this.popperInstance = new Popper(
      this._reference,
      this._tooltipNode,
      popperOptions,
    );
  }

  private _getTooltipContainer(): HTMLElement {
    const container = this._options.container;

    if (!container) {
      return this._reference.parentElement;
    }

    if (typeof container === 'string') {
      return document.querySelector(container);
    }

    return container as HTMLElement;
  }

  private _createTooltipId() {
    const randomId = Math.random()
      .toString(36)
      .substr(2, 10);

    return `tooltip_${randomId}`;
  }
}

Tooltip.extendStyleNames(styles);

export { ITooltip, ITooltipOptions, ITooltipStyles };

export default Tooltip;
