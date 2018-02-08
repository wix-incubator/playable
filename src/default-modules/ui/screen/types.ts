type IScreenViewStyles = {
  screen: string;
  screenTopBackground: string;
  screenBottomBackground: string;
  hidden: string;
  visible: string;
};

type IScreenViewCallbacks = {
  onWrapperMouseClick?: Function;
  onWrapperMouseDblClick?: Function;
};

type IScreenViewConfig = {
  callbacks: IScreenViewCallbacks;
  playbackViewNode: HTMLElement;
  nativeControls: boolean;
};

export { IScreenViewStyles, IScreenViewCallbacks, IScreenViewConfig };
