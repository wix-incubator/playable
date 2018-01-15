import { ITooltipContainer } from './tooltip-container';
import getTooltipPositionByReferenceNode from './utils/getTooltipPositionByReferenceNode';

type ITooltipReferenceOptions = {
  title: string;
};

interface ITooltipReference {
  isHidden: boolean;
  show(): void;
  hide(): void;
  setTitle(title: string): void;
  destroy(): void;
}

const SHOW_EVENTS = ['mouseenter', 'focus'];
const HIDE_EVENTS = ['mouseleave', 'blur'];

class TooltipReference implements ITooltipReference {
  private _$reference: HTMLElement;
  private _tooltipContainer: ITooltipContainer;

  private _options: ITooltipReferenceOptions;
  private _eventListeners: any[];

  constructor(
    reference: HTMLElement,
    tooltipContainer,
    options: ITooltipReferenceOptions,
  ) {
    this._$reference = reference;
    this._tooltipContainer = tooltipContainer;
    this._options = options;

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
    return this._tooltipContainer.isHidden;
  }

  show() {
    this._tooltipContainer.show({
      title: this._options.title,
      position: getTooltipPositionByReferenceNode(
        this._$reference,
        this._tooltipContainer.node,
      ),
    });
  }

  hide() {
    this._tooltipContainer.hide();
  }

  setTitle(title: string) {
    this._options.title = title;
    this._tooltipContainer.setTitle(title);
  }

  destroy() {
    this._eventListeners.forEach(({ event, fn }) => {
      this._$reference.removeEventListener(event, fn);
    });
    this._eventListeners = null;
    this._$reference = null;
    this._tooltipContainer = null;
    this._options = null;
  }
}

export { ITooltipReference, ITooltipReferenceOptions };

export default TooltipReference;
