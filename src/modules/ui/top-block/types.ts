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

  showTitle(): void;
  hideTitle(): void;
  showLiveIndicator(): void;
  hideLiveIndicator(): void;

  showContent(): void;
  hideContent(): void;

  destroy(): void;
}

interface ITopBlockAPI {
  showTitle?(): void;
  hideTitle?(): void;
  showLiveIndicator?(): void;
  hideLiveIndicator?(): void;
}

export {
  ITopBlockAPI,
  ITopBlock,
  ITopBlockViewStyles,
  ITopBlockViewElements,
  ITopBlockViewCallbacks,
  ITopBlockViewConfig,
};
