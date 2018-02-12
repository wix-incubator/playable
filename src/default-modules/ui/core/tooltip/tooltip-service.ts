import TooltipReference, {
  ITooltipReference,
  ITooltipReferenceOptions,
} from './tooltip-reference';
import TooltipContainer from './tooltip-container';
import { ITooltipShowOptions } from './types';
import Tooltip from './tooltip';

interface ITooltipService {
  isHidden: boolean;
  tooltipContainerNode: HTMLElement;
  setText(text: string): void;
  show(options: ITooltipShowOptions): void;
  hide(): void;
  createReference(
    reference: HTMLElement,
    options: ITooltipReferenceOptions,
  ): ITooltipReference;
  destroy(): void;
}

class TooltipService implements ITooltipService {
  static moduleName = 'tooltipService';

  private _tooltip: Tooltip;
  private _tooltipContainer: TooltipContainer;

  constructor() {
    this._tooltip = new Tooltip();
    this._tooltipContainer = new TooltipContainer(this._tooltip);
  }

  get isHidden(): boolean {
    return this._tooltip.isHidden;
  }

  get tooltipContainerNode(): HTMLElement {
    return this._tooltipContainer.node;
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
    this._tooltip.setText(options.text);
    this._tooltip.setStyle(
      this._tooltipContainer.getTooltipPositionStyles(options.position),
    );
    this._tooltip.show();
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
    this._tooltip.destroy();
    this._tooltipContainer.destroy();
    this._tooltip = null;
    this._tooltipContainer = null;
  }
}

export { ITooltipService };

export default TooltipService;
