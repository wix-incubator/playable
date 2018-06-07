import { TooltipPositionPlacement } from '../constants';

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

function getTooltipPositionByReferenceNode(
  tooltipReferenceNode: HTMLElement,
  tooltipContainerNode: HTMLElement,
  tooltipCenterXfn: ITooltipCenterXfn = calcTooltipCenterX,
): Playable.ITooltipPosition {
  const tooltipReferenceRect = tooltipReferenceNode.getBoundingClientRect();
  const tooltipContainerRect = tooltipContainerNode.getBoundingClientRect();

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

export default getTooltipPositionByReferenceNode;
