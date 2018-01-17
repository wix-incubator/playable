import { ITooltipPosition } from '../types';

function getTooltipPositionByReferenceNode(
  tooltipReferenceNode: HTMLElement,
  tooltipContainerNode: HTMLElement,
): ITooltipPosition {
  const referenceRect = tooltipReferenceNode.getBoundingClientRect();
  const containerRect = tooltipContainerNode.getBoundingClientRect();

  const placement = referenceRect.top > containerRect.top ? 'bottom' : 'top';
  const tooltipCenterX =
    referenceRect.left - containerRect.left + referenceRect.width / 2;

  return { placement, x: tooltipCenterX };
}

export default getTooltipPositionByReferenceNode;
