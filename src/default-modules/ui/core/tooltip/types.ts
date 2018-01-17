type ITooltipPositionPlacement = 'top' | 'bottom';

type ITooltipPosition = {
  placement: ITooltipPositionPlacement;
  x: number;
};

type ITooltipShowOptions = {
  text: string;
  position: ITooltipPosition;
};

export { ITooltipPositionPlacement, ITooltipPosition, ITooltipShowOptions };
