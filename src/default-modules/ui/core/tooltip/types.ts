enum ITooltipPositionPlacement {
  TOP = 'top',
  BOTTOM = 'bottom',
}

type ITooltipPosition = {
  placement: ITooltipPositionPlacement;
  x: number;
};

type ITooltipPositionFunction = (
  tooltipContainerNode: HTMLElement,
) => ITooltipPosition;

type ITooltipShowOptions = {
  text: string;
  position: ITooltipPosition | ITooltipPositionFunction;
};

export {
  ITooltipPositionPlacement,
  ITooltipPosition,
  ITooltipPositionFunction,
  ITooltipShowOptions,
};
