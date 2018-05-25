type ITopBlockViewStyles = {
  topBlock: string;
  elementsContainer: string;
  titleContainer: string;
  liveIndicatorContainer: string;
  activated: string;
  hidden: string;
};

type ITopBlockViewElements = {
  title: HTMLElement;
  liveIndicator: HTMLElement;
};

type ITopBlockViewConfig = {
  elements: ITopBlockViewElements;
};

interface ITopBlock {
  node: HTMLElement;

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
  ITopBlockViewConfig,
};
