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

export { ITopBlockViewStyles, ITopBlockViewElements, ITopBlockViewConfig };
