interface IFullScreenConfig {
  exitFullScreenOnEnd?: boolean;
  enterFullScreenOnPlay?: boolean;
  exitFullScreenOnPause?: boolean;
  pauseVideoOnFullScreenExit?: boolean;
}

interface IFullScreenManager {
  enterFullScreen(): void;
  exitFullScreen(): void;
  isInFullScreen: boolean;
  isEnabled: boolean;
  destroy(): void;
}

interface IFullScreenHelper {
  isAPIExist: boolean;
  isInFullScreen: boolean;
  isEnabled: boolean;
  request(): void;
  exit(): void;
  destroy(): void;
}

export { IFullScreenManager, IFullScreenHelper, IFullScreenConfig };
