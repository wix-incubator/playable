declare namespace Playable {
  enum TooltipPositionPlacement {
    TOP = 'top',
    BOTTOM = 'bottom',
  }

  export type ITooltipPosition = {
    placement: TooltipPositionPlacement;
    x: number;
  };

  export type ITooltipPositionFunction = (
    tooltipContainerNode: HTMLElement,
  ) => ITooltipPosition;

  export type ITooltipShowOptions = {
    text: string;
    position: ITooltipPosition | ITooltipPositionFunction;
  };

  export type ITooltipStyles = {
    tooltip: string;
    tooltipVisible: string;
    tooltipInner: string;
  };

  export interface ITooltip {
    node: HTMLElement;
    isHidden: boolean;
    show(): void;
    hide(): void;
    setText(text: string): void;
    setStyle(style: { [key: string]: string | number }): void;
    destroy(): void;
  }

  export type ITooltipReferenceOptions = {
    text: string;
  };

  export interface ITooltipReference {
    isHidden: boolean;
    isDisabled: boolean;
    show(): void;
    hide(): void;
    setText(text: string): void;
    disable(): void;
    enable(): void;
    destroy(): void;
  }

  export interface ITooltipService {
    isHidden: boolean;
    tooltipContainerNode: HTMLElement;
    setText(text: string): void;
    show(options: ITooltipShowOptions): void;
    hide(): void;
    createReference(
      reference: HTMLElement,
      options: ITooltipReferenceOptions,
    ): ITooltipReference;
    destroy(): void;
  }
}
