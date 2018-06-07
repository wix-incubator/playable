import { getTooltipPositionByReferenceNode } from '../../../core/tooltip';

function calcProgressTimeTooltipCenterX(
  progressPercent: number,
  progressNodeOffsetX: number,
  progressNodeWidth: number,
) {
  return progressNodeOffsetX + progressPercent * progressNodeWidth / 100;
}

function getProgressTimeTooltipPosition(
  progressPercent: number,
  progressNode: HTMLElement,
  tooltipContainerNode: HTMLElement,
): Playable.ITooltipPosition {
  return getTooltipPositionByReferenceNode(
    progressNode,
    tooltipContainerNode,
    (progressNodeOffsetX, progressNodeWidth) =>
      calcProgressTimeTooltipCenterX(
        progressPercent,
        progressNodeOffsetX,
        progressNodeWidth,
      ),
  );
}

export default getProgressTimeTooltipPosition;
