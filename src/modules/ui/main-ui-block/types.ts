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

interface IMainUIBlockConfig {
  shouldAlwaysShow?: boolean;
}

interface IMainUIBlock {
  node: HTMLElement;

  enableShowingContent(): void;
  disableShowingContent(): void;

  show(): void;
  hide(): void;

  setShouldAlwaysShow(flag: boolean): void;
  destroy(): void;
}

export {
  IMainUIBlock,
  IMainUIBlockConfig,
  IMainUIBlockViewStyles,
  IMainUIBlockViewElements,
  IMainUIBlockViewConfig,
};
