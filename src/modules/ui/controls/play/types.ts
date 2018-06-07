type IPlayViewStyles = {
  playControl: string;
  playbackToggle: string;
  icon: string;
  paused: string;
  hidden: string;
};

type IPlayViewCallbacks = {
  onButtonClick: Function;
};

type IPlayViewConfig = {
  callbacks: IPlayViewCallbacks;
  textMap: Playable.ITextMap;
  theme: Playable.IThemeService;
};

interface IPlayControl {
  node: HTMLElement;

  setControlStatus(isPlaying: boolean): void;
  reset(): void;

  destroy(): void;
}

export { IPlayControl, IPlayViewStyles, IPlayViewCallbacks, IPlayViewConfig };
