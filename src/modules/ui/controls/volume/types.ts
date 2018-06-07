type IVolumeViewStyles = {
  volumeControl: string;
  volumeInputBlock: string;
  isDragging: string;
  muteButton: string;
  icon: string;
  progressBar: string;
  volume: string;
  background: string;
  hitbox: string;
  hidden: string;
};

type IVolumeViewCallbacks = {
  onVolumeLevelChangeFromInput: Function;
  onVolumeLevelChangeFromWheel: Function;
  onToggleMuteClick: Function;
  onDragStart: Function;
  onDragEnd: Function;
};

type IVolumeViewConfig = {
  callbacks: IVolumeViewCallbacks;
  textMap: Playable.ITextMap;
  theme: Playable.IThemeService;
  tooltipService: Playable.ITooltipService;
};

interface IVolumeControl {
  node: HTMLElement;

  setVolumeLevel(level: number): void;
  setMuteStatus(isMuted: boolean): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IVolumeControl,
  IVolumeViewStyles,
  IVolumeViewCallbacks,
  IVolumeViewConfig,
};
