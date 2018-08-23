type IBottomBlockViewStyles = {
  bottomBlock: string;
  elementsContainer: string;
  progressBarContainer: string;
  controlsContainerLeft: string;
  controlsContainerRight: string;
  logoContainer: string;
  playContainer: string;
  volumeContainer: string;
  timeContainer: string;
  fullScreenContainer: string;
  showLogoAlways: string;
  logoHidden: string;
  activated: string;
  hidden: string;
  playControlHidden: string;
  timeControlHidden: string;
  volumeControlHidden: string;
  fullScreenControlHidden: string;
  progressControlHidden: string;
  downloadButtonHidden: string;
};

type IBottomBlockViewCallbacks = {
  onBlockMouseMove: EventListenerOrEventListenerObject;
  onBlockMouseOut: EventListenerOrEventListenerObject;
};

type IBottomBlockViewElements = {
  play: HTMLElement;
  volume: HTMLElement;
  time: HTMLElement;
  fullScreen: HTMLElement;
  logo: HTMLElement;
  progress: HTMLElement;
  download: HTMLElement;
};

type IBottomBlockViewConfig = {
  callbacks: IBottomBlockViewCallbacks;
  elements: IBottomBlockViewElements;
};

interface IBottomBlock {
  node: HTMLElement;
  isFocused: boolean;
  showContent(): void;
  hideContent(): void;
  show(): void;
  hide(): void;
  setLogoAlwaysShowFlag(flag: boolean): void;
  showLogo(): void;
  hideLogo(): void;
  showPlayControl(): void;
  hidePlayControl(): void;
  showTimeControl(): void;
  hideTimeControl(): void;
  showProgressControl(): void;
  hideProgressControl(): void;
  showFullScreenControl(): void;
  hideFullScreenControl(): void;
  showVolumeControl(): void;
  hideVolumeControl(): void;
  destroy(): void;
}

export {
  IBottomBlock,
  IBottomBlockViewStyles,
  IBottomBlockViewCallbacks,
  IBottomBlockViewConfig,
  IBottomBlockViewElements,
};
