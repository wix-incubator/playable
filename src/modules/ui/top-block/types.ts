type ITopBlockViewStyles = {
  topBlock: string;
  elementsContainer: string;
  titleContainer: string;
  liveIndicatorContainer: string;
  activated: string;
  hidden: string;
};

type ITopBlockViewCallbacks = {
  onBlockMouseMove: EventListenerOrEventListenerObject;
  onBlockMouseOut: EventListenerOrEventListenerObject;
};

type ITopBlockViewElements = {
  title: HTMLElement;
  liveIndicator: HTMLElement;
  topButtons: HTMLElement;
};

type ITopBlockViewConfig = {
  elements: ITopBlockViewElements;
  callbacks: ITopBlockViewCallbacks;
};

interface ITopBlock {
  getElement(): HTMLElement;
  isFocused: boolean;

  show(): void;
  hide(): void;

  showContent(): void;
  hideContent(): void;

  destroy(): void;
}

export {
  ITopBlock,
  ITopBlockViewStyles,
  ITopBlockViewElements,
  ITopBlockViewCallbacks,
  ITopBlockViewConfig,
};
