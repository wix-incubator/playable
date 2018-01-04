import Tooltip, { ITooltip, ITooltipOptions } from './Tooltip';

interface ITooltipService {
  create(reference: HTMLElement, options: ITooltipOptions): ITooltip;
}

class TooltipService implements ITooltipService {
  static dependencies = ['rootContainer'];
  private _rootContainer;

  constructor({ rootContainer }) {
    this._rootContainer = rootContainer;
  }

  create(reference: HTMLElement, options: ITooltipOptions) {
    return new Tooltip(reference, {
      ...options,
      boundariesElement: this._rootContainer.node,
    });
  }
}

export { ITooltipService };

export default TooltipService;
