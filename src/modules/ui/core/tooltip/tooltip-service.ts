import TooltipReference from './tooltip-reference';
import TooltipContainer from './tooltip-container';
import Tooltip from './tooltip';

import { UI_EVENTS } from '../../../../constants';

import {
  ITooltipShowOptions,
  ITooltipService,
  ITooltipReferenceOptions,
} from './types';
import { IEventEmitter } from '../../../event-emitter/types';

class TooltipService implements ITooltipService {
  static moduleName = 'tooltipService';
  static dependencies = ['eventEmitter'];
  private _tooltip: Tooltip;
  private _tooltipContainer: TooltipContainer;
  private _eventEmitter: IEventEmitter;

  private _unbindEvents: () => void;

  constructor({ eventEmitter }: { eventEmitter: IEventEmitter }) {
    this._eventEmitter = eventEmitter;
    this._tooltip = new Tooltip();
    this._tooltipContainer = new TooltipContainer(this._tooltip);
    this._bindEvents();
  }

  get isHidden(): boolean {
    return this._tooltip.isHidden;
  }

  get tooltipContainerElement(): HTMLElement {
    return this._tooltipContainer.getElement();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [[UI_EVENTS.FULL_SCREEN_STATE_CHANGED, this.hide]],
      this,
    );
  }

  /**
   * Set new tooltip title
   */
  setText(text: string) {
    this._tooltip.setText(text);
  }

  /**
   * Show tooltip with title
   */
  show(options: ITooltipShowOptions) {
    // NOTE: its important to set tooltip text before update tooltip position styles
    if (options.element) {
      this._tooltip.setElement(options.element);
    } else {
      this._tooltip.setText(options.text);
    }
    this._tooltip.setStyle(
      this._tooltipContainer.getTooltipPositionStyles(options.position),
    );
    this._tooltip.show();
  }

  clearElement() {
    this._tooltip.clearElement();
  }

  /**
   * Hide tooltip
   */
  hide() {
    this._tooltip.hide();
  }

  /**
   * Create tooltip reference which show/hide tooltip on hover and focus events
   * @param reference - reference node
   * @param options - tooltip title and other options
   * @returns tooltip reference instance
   */
  createReference(
    reference: HTMLElement,
    options: ITooltipReferenceOptions,
  ): TooltipReference {
    return new TooltipReference(reference, this, options);
  }

  destroy() {
    this._unbindEvents();

    this._tooltip.destroy();
    this._tooltipContainer.destroy();
    this._tooltip = null;
    this._tooltipContainer = null;

    this._eventEmitter = null;
  }
}

export { ITooltipService };

export default TooltipService;
