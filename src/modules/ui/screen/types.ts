type IScreenViewStyles = {
  screen: string;
  screenTopBackground: string;
  screenBottomBackground: string;
  hidden: string;
  visible: string;
  hiddenCursor: string;
  horizontalStripes: string;
  verticalStripes: string;
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
  playbackViewElement: HTMLElement;
  nativeControls: boolean;
};

enum VideoViewMode {
  REGULAR = 'REGULAR',
  BLUR = 'BLUR',
  FILL = 'FILL',
}

interface IScreen {
  getElement(): HTMLElement;
  showCursor(): void;
  hideCursor(): void;

  show(): void;
  hide(): void;

  setVideoViewMode(viewMode: VideoViewMode): void;

  destroy(): void;
}

export {
  IScreen,
  VideoViewMode,
  IScreenViewStyles,
  IScreenViewCallbacks,
  IScreenViewConfig,
};
