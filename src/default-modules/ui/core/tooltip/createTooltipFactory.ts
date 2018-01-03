import Tooltip, { ITooltipOptions } from './Tooltip';

type ITooltipFactory = (
  reference: HTMLElement,
  options: ITooltipOptions,
) => Tooltip;

function createTooltipFactory({ rootContainer }): ITooltipFactory {
  return function createTooltip(
    reference: HTMLElement,
    options: ITooltipOptions,
  ) {
    return new Tooltip(reference, {
      ...options,
      boundariesElement: rootContainer.node,
    });
  };
}

(createTooltipFactory as any).dependencies = ['rootContainer'];

export { ITooltipFactory };

export default createTooltipFactory;
