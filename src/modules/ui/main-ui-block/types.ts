interface IMainUIBlockViewStyles {
  mainUiBlock: string;
  tooltipContainerWrapper: string;
  hidden: string;
}

interface IMainUIBlockViewElements {
  tooltipContainer: HTMLElement;
  topBlock: HTMLElement;
  bottomBlock: HTMLElement;
}

interface IMainUIBlockViewConfig {
  elements: IMainUIBlockViewElements;
}

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
