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
};

type IBottomBlockViewConfig = {
  callbacks: IBottomBlockViewCallbacks;
  elements: IBottomBlockViewElements;
};

export {
  IBottomBlockViewStyles,
  IBottomBlockViewCallbacks,
  IBottomBlockViewConfig,
  IBottomBlockViewElements,
};
