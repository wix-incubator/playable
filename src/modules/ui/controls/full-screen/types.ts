type IFullScreenViewStyles = {
  fullScreenControl: string;
  fullScreenToggle: string;
  icon: string;
  inFullScreen: string;
  hidden: string;
};

type IFullScreenViewCallbacks = {
  onButtonClick: Function;
};

type IFullScreenViewConfig = {
  callbacks: IFullScreenViewCallbacks;
  textMap: Playable.ITextMap;
  theme: Playable.IThemeService;
  tooltipService: Playable.ITooltipService;
};

interface IFullScreenControl {
  node: HTMLElement;

  setControlStatus(isInFullScreen: boolean): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IFullScreenControl,
  IFullScreenViewStyles,
  IFullScreenViewCallbacks,
  IFullScreenViewConfig,
};
