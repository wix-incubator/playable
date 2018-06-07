type ITimeViewStyles = {
  timeWrapper: string;
  time: string;
  current: string;
  separator: string;
  duration: string;
  hidden: string;
};

type ITimeViewConfig = {
  theme: Playable.IThemeService;
};

interface ITimeControl {
  node: HTMLElement;

  setDurationTime(time: number): void;
  setCurrentTime(time: number): void;
  reset(): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export { ITimeControl, ITimeViewStyles, ITimeViewConfig };
