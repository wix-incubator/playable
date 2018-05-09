type IScreenViewStyles = {
  screen: string;
  screenTopBackground: string;
  screenBottomBackground: string;
  hidden: string;
  visible: string;
  hiddenCursor: string;
  horizontalVideo: string;
  verticalVideo: string;
};

type IScreenViewCallbacks = {
  onWrapperMouseClick: EventListenerOrEventListenerObject;
  onWrapperMouseDblClick: EventListenerOrEventListenerObject;
};

type IScreenViewConfig = {
  callbacks: IScreenViewCallbacks;
  playbackViewNode: HTMLElement;
  nativeControls: boolean;
};

interface IScreenConfig {
  disableClickProcessing?: boolean;
  nativeControls?: boolean;
}

export {
  IScreenConfig,
  IScreenViewStyles,
  IScreenViewCallbacks,
  IScreenViewConfig,
};
