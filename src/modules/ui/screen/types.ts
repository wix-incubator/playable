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
  playbackViewNode: HTMLVideoElement;
  videoBackgroundNode: HTMLCanvasElement;
  nativeControls: boolean;
};

interface IScreenConfig {
  disableClickProcessing?: boolean;
  nativeControls?: boolean;
}

enum VideoOrientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
}

export {
  VideoOrientation,
  IScreenConfig,
  IScreenViewStyles,
  IScreenViewCallbacks,
  IScreenViewConfig,
};
