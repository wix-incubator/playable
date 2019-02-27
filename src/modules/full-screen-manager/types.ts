interface IFullScreenConfig {
  exitFullScreenOnEnd?: boolean;
  enterFullScreenOnPlay?: boolean;
  exitFullScreenOnPause?: boolean;
  pauseVideoOnFullScreenExit?: boolean;
}

interface IFullScreenManager {
  enterFullScreen(): void;
  exitFullScreen(): void;
  enableExitFullScreenOnPause(): void;
  disableExitFullScreenOnPause(): void;
  enableExitFullScreenOnEnd(): void;
  disableExitFullScreenOnEnd(): void;
  enableEnterFullScreenOnPlay(): void;
  disableEnterFullScreenOnPlay(): void;
  enablePauseVideoOnFullScreenExit(): void;
  disablePauseVideoOnFullScreenExit(): void;
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

interface IFullScreenAPI {
  enableExitFullScreenOnPause?(): void;
  disableExitFullScreenOnPause?(): void;
  enableExitFullScreenOnEnd?(): void;
  disableExitFullScreenOnEnd?(): void;
  enableEnterFullScreenOnPlay?(): void;
  disableEnterFullScreenOnPlay?(): void;
  enablePauseVideoOnFullScreenExit?(): void;
  disablePauseVideoOnFullScreenExit?(): void;
  enterFullScreen?(): void;
  exitFullScreen?(): void;
  isInFullScreen?: boolean;
}

export {
  IFullScreenAPI,
  IFullScreenManager,
  IFullScreenHelper,
  IFullScreenConfig,
};
