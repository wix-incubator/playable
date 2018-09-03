import { ITooltipPosition, TooltipPositionPlacement } from '../types';

type ITooltipCenterXfn = (
  tooltipReferenceOffsetX: number,
  tooltipReferenceWidth: number,
) => number;

function calcTooltipCenterX(
  tooltipReferenceOffsetX: number,
  tooltipReferenceWidth: number,
) {
  return tooltipReferenceOffsetX + tooltipReferenceWidth / 2;
}

function getTooltipPositionByReferenceElement(
  tooltipReferenceElement: HTMLElement,
  tooltipContainerElement: HTMLElement,
  tooltipCenterXfn: ITooltipCenterXfn = calcTooltipCenterX,
): ITooltipPosition {
  const tooltipReferenceRect = tooltipReferenceElement.getBoundingClientRect();
  const tooltipContainerRect = tooltipContainerElement.getBoundingClientRect();

  const tooltipPlacement =
    tooltipReferenceRect.top > tooltipContainerRect.top
      ? TooltipPositionPlacement.BOTTOM
      : TooltipPositionPlacement.TOP;
  const tooltipReferenceOffsetX =
    tooltipReferenceRect.left - tooltipContainerRect.left;
  const tooltipCenterX = tooltipCenterXfn(
    tooltipReferenceOffsetX,
    tooltipReferenceRect.width,
  );

  return { placement: tooltipPlacement, x: tooltipCenterX };
}

export default getTooltipPositionByReferenceElement;
