type IScreenViewStyles = {
  screen: string;
  screenTopBackground: string;
  screenBottomBackground: string;
  hidden: string;
  visible: string;
  hiddenCursor: string;
  horizontalVideo: string;
  verticalVideo: string;
  fillMode: string;
  blurMode: string;
  regularMode: string;
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

enum VideoViewMode {
  REGULAR = 'REGULAR',
  BLUR = 'BLUR',
  FILL = 'FILL',
}

export {
  VideoViewMode,
  IScreenConfig,
  IScreenViewStyles,
  IScreenViewCallbacks,
  IScreenViewConfig,
};
