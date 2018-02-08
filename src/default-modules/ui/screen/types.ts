type IScreenViewStyles = {
  screen: string;
  screenTopBackground: string;
  screenBottomBackground: string;
  hidden: string;
  visible: string;
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

export { IScreenViewStyles, IScreenViewCallbacks, IScreenViewConfig };
