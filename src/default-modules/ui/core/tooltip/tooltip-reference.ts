import { ITooltipService } from './tooltip-service';
import getTooltipPositionByReferenceNode from './utils/getTooltipPositionByReferenceNode';

type ITooltipReferenceOptions = {
  text: string;
};

interface ITooltipReference {
  isHidden: boolean;
  show(): void;
  hide(): void;
  setText(text: string): void;
  destroy(): void;
}

const SHOW_EVENTS = ['mouseenter', 'focus'];
const HIDE_EVENTS = ['mouseleave', 'blur'];

class TooltipReference implements ITooltipReference {
  private _$reference: HTMLElement;
  private _tooltipService: ITooltipService;

  private _options: ITooltipReferenceOptions;
  private _eventListeners: any[];

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

  show() {
    this._tooltipService.show({
      text: this._options.text,
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

export { ITooltipReference, ITooltipReferenceOptions };

export default TooltipReference;
