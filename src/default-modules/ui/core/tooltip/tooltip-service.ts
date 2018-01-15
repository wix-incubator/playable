import TooltipReference, {
  ITooltipReference,
  ITooltipReferenceOptions,
} from './tooltip-reference';
import { ITooltipContainer } from './tooltip-container';
import { ITooltipShowOptions } from './types';

interface ITooltipService {
  show(options: ITooltipShowOptions): void;
  hide(): void;
  createReference(
    reference: HTMLElement,
    options: ITooltipReferenceOptions,
  ): ITooltipReference;
  destroy(): void;
}

class TooltipService implements ITooltipService {
  static dependencies = ['tooltipContainer'];

  private _tooltipContainer: ITooltipContainer;

  constructor({ tooltipContainer }) {
    this._tooltipContainer = tooltipContainer;
  }

  /**
   * Show tooltip with title
   * @param options.title
   * @param options.position
   */
  show(options: ITooltipShowOptions) {
    this._tooltipContainer.show(options);
  }

  /**
   * Hide tooltip
   */
  hide() {
    this._tooltipContainer.hide();
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
    return new TooltipReference(reference, this._tooltipContainer, options);
  }

  destroy() {
    this._tooltipContainer = null;
  }
}

export { ITooltipService };

export default TooltipService;
