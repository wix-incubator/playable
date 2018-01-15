type ITooltipPositionPlacement = 'top' | 'bottom';

type ITooltipPosition = {
  placement: ITooltipPositionPlacement;
  x: number;
};

type ITooltipShowOptions = {
  title: string;
  position: ITooltipPosition;
};

export { ITooltipPositionPlacement, ITooltipPosition, ITooltipShowOptions };
