enum TooltipPositionPlacement {
  TOP = 'top',
  BOTTOM = 'bottom',
}

type ITooltipPosition = {
  placement: TooltipPositionPlacement;
  x: number;
};

type ITooltipPositionFunction = (
  tooltipContainerElement: HTMLElement,
) => ITooltipPosition;

type ITooltipShowOptions = {
  text?: string;
  element?: HTMLElement;
  position: ITooltipPosition | ITooltipPositionFunction;
};

type ITooltipStyles = {
  tooltip: string;
  tooltipVisible: string;
  tooltipInner: string;
  showAsText: string;
  showAsElement: string;
};

interface ITooltip {
  getElement(): HTMLElement;
  isHidden: boolean;
  show(): void;
  hide(): void;
  setText(text: string): void;
  setStyle(style: { [key: string]: string | number }): void;
  destroy(): void;
}

type ITooltipReferenceOptions = {
  text?: string;
  element?: HTMLElement;
};

interface ITooltipReference {
  isHidden: boolean;
  isDisabled: boolean;
  show(): void;
  hide(): void;
  setText(text: string): void;
  disable(): void;
  enable(): void;
  destroy(): void;
}

interface ITooltipService {
  isHidden: boolean;
  tooltipContainerElement: HTMLElement;
  setText(text: string): void;
  show(options: ITooltipShowOptions): void;
  hide(): void;
  createReference(
    reference: HTMLElement,
    options: ITooltipReferenceOptions,
  ): ITooltipReference;
  destroy(): void;
}

export {
  TooltipPositionPlacement,
  ITooltipPosition,
  ITooltipPositionFunction,
  ITooltipShowOptions,
  ITooltipStyles,
  ITooltip,
  ITooltipReference,
  ITooltipReferenceOptions,
  ITooltipService,
};
