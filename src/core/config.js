import { iPhone, iPod, Android, iPad } from '../utils/device-detection';


export function getAnomalyBloodhoundConfig(params) {
  const { logger } = params;

  return logger;
}

export function getUIConfig(params) {
  const { size, controls, overlay, loader, screen, customUI = {}, loadingCover, watchOnSite, fillAllSpace } = params;
  const config = {
    ...size,
    overlay,
    screen,
    customUI,
    loader,
    controls,
    watchOnSite,
    fillAllSpace
  };

  if (iPhone || iPod || iPad) {
    config.screen = {
      ...screen,
      indicateScreenClick: false,
      disableClickProcessing: true,
      nativeControls: true
    };
    config.loader = false;
    config.controls = false;
  } else if (Android) {
    config.screen = {
      ...screen,
      disableClickProcessing: true
    };
  }

  if (loadingCover) {
    config.loadingCover = {
      url: loadingCover
    };
  }

  return config;
}

export function getEngineConfig(params) {
  const { preload, autoPlay, loop, muted, volume, src, playInline } = params;

  return { preload, autoPlay, loop, muted, volume, src, playInline };
}

export function getFullScreenManagerConfig(params) {
  const {
    exitFullScreenOnEnd,
    enterFullScreenOnPlay,
    exitFullScreenOnPause,
    disableFullScreen,
    pauseVideoOnFullScreenExit
  } = params;
  const config = {};

  if (exitFullScreenOnEnd !== void 0) {
    config.exitOnEnd = exitFullScreenOnEnd;
  }

  if (enterFullScreenOnPlay !== void 0) {
    config.enterOnPlay = enterFullScreenOnPlay;
  }

  if (disableFullScreen !== void 0) {
    config.disabled = disableFullScreen;
  }

  if (exitFullScreenOnPause !== void 0) {
    config.exitOnPause = exitFullScreenOnPause;
  }

  if (pauseVideoOnFullScreenExit !== void 0) {
    config.pauseOnExit = pauseVideoOnFullScreenExit;
  }

  return config;
}

export default function convertParamsToConfig(params) {
  return {
    ui: getUIConfig(params),
    engine: getEngineConfig(params),
    anomalyBloodhound: getAnomalyBloodhoundConfig(params),
    fullScreenManager: getFullScreenManagerConfig(params)
  };
}

