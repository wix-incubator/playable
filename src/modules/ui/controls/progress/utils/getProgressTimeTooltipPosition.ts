import { getTooltipPositionByReferenceElement } from '../../../core/tooltip';

import { ITooltipPosition } from '../../../core/tooltip/types';

function calcProgressTimeTooltipCenterX(
  progressPercent: number,
  progressElementOffsetX: number,
  progressElementWidth: number,
) {
  return (
    progressElementOffsetX + (progressPercent * progressElementWidth) / 100
  );
}

function getProgressTimeTooltipPosition(
  progressPercent: number,
  progressElement: HTMLElement,
  tooltipContainer: HTMLElement,
): ITooltipPosition {
  return getTooltipPositionByReferenceElement(
    progressElement,
    tooltipContainer,
    (progressElementOffsetX, progressElementWidth) =>
      calcProgressTimeTooltipCenterX(
        progressPercent,
        progressElementOffsetX,
        progressElementWidth,
      ),
  );
}

export default getProgressTimeTooltipPosition;
