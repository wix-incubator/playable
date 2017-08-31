import { isIPhone, isIPod, isIPad, isAndroid } from '../utils/device-detection';
import pick from 'lodash/pick';

const getTextMapConfig = params => params.texts || {};

const getAnomalyBloodhoundConfig = params => params.logger;

const getEngineConfig = params => pick(params, ['preload', 'autoPlay', 'loop', 'muted', 'volume', 'src', 'playInline']);

const getFullScreenManagerConfig = params =>
  ({
    disabled: Boolean(params.disableFullScreen),
    exitOnEnd: Boolean(params.exitFullScreenOnEnd),
    enterOnPlay: Boolean(params.enterFullScreenOnPlay),
    exitOnPause: Boolean(params.exitFullScreenOnPause),
    pauseOnExit: Boolean(params.pauseVideoOnFullScreenExit)
  });

const convertUIConfigForIOS = config =>
  ({
    ...config,
    screen: {
      ...config.screen,
      indicateScreenClick: false,
      disableClickProcessing: true,
      nativeControls: true
    },
    loader: false,
    controls: false
  });
const convertUIConfigForAndroid = config =>
  ({
    ...config,
    screen: {
      ...config.screen,
      disableClickProcessing: true
    }
  });

const getUIConfig = params => {
    const config = {
      ...params.size,
      ...pick(params, ['overlay', 'screen', 'customUI', 'loader', 'controls', 'watchOnSite', 'fillAllSpace', 'loadingCover'])
    };

    if (isIPhone() || isIPod() || isIPad()) {
      return convertUIConfigForIOS(config);
    } else if (isAndroid()) {
      return convertUIConfigForAndroid(config);
    }

    return config;
  };

const mapParamsToConfig = (params = {}) =>
  ({
    textMap: getTextMapConfig(params),
    ui: getUIConfig(params),
    engine: getEngineConfig(params),
    anomalyBloodhound: getAnomalyBloodhoundConfig(params),
    fullScreenManager: getFullScreenManagerConfig(params)
  });

export {
  getTextMapConfig,
  getAnomalyBloodhoundConfig,
  getEngineConfig,
  getUIConfig,
  getFullScreenManagerConfig,
  convertUIConfigForIOS,
  convertUIConfigForAndroid
};

export default mapParamsToConfig;
