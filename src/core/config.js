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
    fillAllSpace,
    loadingCover
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

  config.exitOnEnd = Boolean(exitFullScreenOnEnd);
  config.enterOnPlay = Boolean(enterFullScreenOnPlay);
  config.disabled = Boolean(disableFullScreen);
  config.exitOnPause = Boolean(exitFullScreenOnPause);
  config.pauseOnExit = Boolean(pauseVideoOnFullScreenExit);

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

