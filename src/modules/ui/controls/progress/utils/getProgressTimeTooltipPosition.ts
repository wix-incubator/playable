import {
  getTooltipPositionByReferenceNode,
  ITooltipPosition,
} from '../../../core/tooltip';

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
): ITooltipPosition {
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
