import {
  ITooltipService,
  ITooltipReference,
  ITooltipReferenceOptions,
} from './types';
import getTooltipPositionByReferenceNode from './utils/getTooltipPositionByReferenceNode';

const SHOW_EVENTS = ['mouseenter', 'focus'];
const HIDE_EVENTS = ['mouseleave', 'blur'];

class TooltipReference implements ITooltipReference {
  private _$reference: HTMLElement;
  private _tooltipService: ITooltipService;

  private _options: ITooltipReferenceOptions;
  private _eventListeners: {
    event: string;
    fn: EventListener;
  }[];

  private _isDisabled: boolean;

  constructor(
    reference: HTMLElement,
    tooltipService: ITooltipService,
    options: ITooltipReferenceOptions,
  ) {
    this._$reference = reference;
    this._options = options;
    this._tooltipService = tooltipService;

    this._eventListeners = [];

    this._bindEvents();
  }

  private _bindEvents() {
    SHOW_EVENTS.forEach(event => {
      const fn = () => {
        this.show();
      };
      this._eventListeners.push({ event, fn });
      this._$reference.addEventListener(event, fn);
    });

    HIDE_EVENTS.forEach(event => {
      const fn = () => {
        this.hide();
      };
      this._eventListeners.push({ event, fn });
      this._$reference.addEventListener(event, fn);
    });
  }

  get isHidden(): boolean {
    return this._tooltipService.isHidden;
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  show() {
    if (this._isDisabled) {
      return;
    }

    this._tooltipService.show({
      text: this._options.text,
      element: this._options.element,
      position: getTooltipPositionByReferenceNode(
        this._$reference,
        this._tooltipService.tooltipContainerNode,
      ),
    });
  }

  hide() {
    this._tooltipService.hide();
  }

  setText(text: string) {
    this._options.text = text;
    this._tooltipService.setText(text);
  }

  disable() {
    this._isDisabled = true;
  }

  enable() {
    this._isDisabled = false;
  }

  destroy() {
    this._eventListeners.forEach(({ event, fn }) => {
      this._$reference.removeEventListener(event, fn);
    });
    this._eventListeners = null;
    this._$reference = null;
    this._tooltipService = null;
    this._options = null;
  }
}

export default TooltipReference;
