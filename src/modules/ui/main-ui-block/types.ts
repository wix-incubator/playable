type IMainUIBlockViewStyles = {
  mainUiBlock: string;
  tooltipContainerWrapper: string;
  hidden: string;
};

type IMainUIBlockViewElements = {
  tooltipContainer: HTMLElement;
  topBlock: HTMLElement;
  bottomBlock: HTMLElement;
};

type IMainUIBlockViewConfig = {
  elements: IMainUIBlockViewElements;
};

export {
  IMainUIBlockViewStyles,
  IMainUIBlockViewElements,
  IMainUIBlockViewConfig,
};
