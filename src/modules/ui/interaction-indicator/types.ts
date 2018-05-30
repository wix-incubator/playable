type IInteractionIndicatorViewStyles = {
  iconContainer: string;
  icon: string;
  animatedIcon: string;
  playIcon: string;
  pauseIcon: string;
  seconds: string;
  hidden: string;
};

interface IInteractionIndicator {
  node: HTMLElement;

  showPause(): void;
  showPlay(): void;
  showRewind(): void;
  showForward(): void;
  showMute(): void;
  showIncreaseVolume(): void;
  showDecreaseVolume(): void;
  hideIcons(): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export { IInteractionIndicator, IInteractionIndicatorViewStyles };
