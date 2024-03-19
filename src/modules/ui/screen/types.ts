type IScreenViewStyles = {
  screen: string;
  screenTopBackground: string;
  screenBottomBackground: string;
  hidden: string;
  visible: string;
  horizontalStripes: string;
  verticalStripes: string;
  fillMode: string;
  blurMode: string;
  regularMode: string;
};

type IScreenViewConfig = {
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

  show(): void;
  hide(): void;

  setVideoViewMode(viewMode: VideoViewMode): void;

  destroy(): void;
}

interface IScreenAPI {
  setVideoViewMode?(viewMode: VideoViewMode): void;
}

export {
  IScreenAPI,
  IScreen,
  VideoViewMode,
  IScreenViewStyles,
  IScreenViewConfig,
};
