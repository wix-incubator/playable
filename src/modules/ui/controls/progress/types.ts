type IProgressViewStyles = {
  seekBlock: string;
  progressBarsWrapper: string;
  progressBar: string;
  background: string;
  buffered: string;
  seekTo: string;
  played: string;
  timeIndicators: string;
  hitbox: string;
  syncButton: string;
  hidden: string;
  inLive: string;
  isDragging: string;
  liveSync: string;
};

type IProgressViewCallbacks = {
  onChangePlayedProgress: Function;
  onSeekToByMouseStart: Function;
  onSeekToByMouseEnd: Function;
  onSyncWithLiveClick: Function;
  onSyncWithLiveMouseEnter: EventListenerOrEventListenerObject;
  onSyncWithLiveMouseLeave: EventListenerOrEventListenerObject;
  onDragStart: Function;
  onDragEnd: Function;
};

type IProgressViewConfig = {
  callbacks: IProgressViewCallbacks;
  textMap: Playable.ITextMap;
  theme: Playable.IThemeService;
  tooltipService: Playable.ITooltipService;
};

interface IProgressControl {
  node: HTMLElement;

  addTimeIndicator(time: number): void;
  addTimeIndicators(times: number[]): void;
  clearTimeIndicators(): void;

  updatePlayed(percent: number): void;
  updateBuffered(percent: number): void;

  reset(): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IProgressControl,
  IProgressViewStyles,
  IProgressViewCallbacks,
  IProgressViewConfig,
};
