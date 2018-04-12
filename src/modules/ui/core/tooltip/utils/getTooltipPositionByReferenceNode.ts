import { ITooltipPosition, ITooltipPositionPlacement } from '../types';

type ITooltipCenterXfn = (
  tooltipReferenceOffsetX: number,
  tooltipReferenceWidth: number,
) => number;

function calcTooltipCenterX(tooltipReferenceOffsetX, tooltipReferenceWidth) {
  return tooltipReferenceOffsetX + tooltipReferenceWidth / 2;
}

function getTooltipPositionByReferenceNode(
  tooltipReferenceNode: HTMLElement,
  tooltipContainerNode: HTMLElement,
  tooltipCenterXfn: ITooltipCenterXfn = calcTooltipCenterX,
): ITooltipPosition {
  const tooltipReferenceRect = tooltipReferenceNode.getBoundingClientRect();
  const tooltipContainerRect = tooltipContainerNode.getBoundingClientRect();

  const tooltipPlacement =
    tooltipReferenceRect.top > tooltipContainerRect.top
      ? ITooltipPositionPlacement.BOTTOM
      : ITooltipPositionPlacement.TOP;
  const tooltipReferenceOffsetX =
    tooltipReferenceRect.left - tooltipContainerRect.left;
  const tooltipCenterX = tooltipCenterXfn(
    tooltipReferenceOffsetX,
    tooltipReferenceRect.width,
  );

  return { placement: tooltipPlacement, x: tooltipCenterX };
}

export default getTooltipPositionByReferenceNode;
