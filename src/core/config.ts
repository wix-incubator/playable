import { isIOS, isAndroid } from '../utils/device-detection';

import { ITitleConfig } from '../default-modules/ui/title/title';
import { IFullScreenConfig } from '../default-modules/full-screen-manager/full-screen-manager';
import { ILogoConfig } from '../default-modules/ui/controls/logo/logo';
import { IOverlayConfig } from '../default-modules/ui/overlay/overlay';
import { ITextMapConfig } from '../default-modules/text-map/text-map';
import { IScreenConfig } from '../default-modules/ui/screen/screen';
import { IControlsConfig } from '../default-modules/ui/main-ui-block/main-ui-block';
import {
  PreloadTypes,
  MediaSource,
} from '../default-modules/playback-engine/playback-engine';
import { IPlayerSize } from '../default-modules/root-container/root-container';

export interface IPlayerConfig {
  src?: MediaSource;

  size?: IPlayerSize;

  videoElement?: HTMLVideoElement;

  preload?: PreloadTypes;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playInline?: boolean;

  title?: boolean | ITitleConfig;
  loader?: boolean;
  screen?: IScreenConfig;
  controls?: boolean | IControlsConfig;
  overlay?: boolean | IOverlayConfig;
  fullScreen?: boolean | IFullScreenConfig;
  logo?: boolean | ILogoConfig;

  texts?: ITextMapConfig;

  showInteractionIndicator?: boolean;
  fillAllSpace?: boolean;
  disableControlWithKeyboard?: boolean;
}

const convertUIConfigForIOS = params => ({
  ...params,
  showInteractionIndicator: false,
  screen: {
    ...params.screen,
    disableClickProcessing: true,
    nativeControls: true,
  },
  title: false,
  loader: false,
  controls: false,
});

const convertUIConfigForAndroid = params => ({
  ...params,
  screen: {
    ...params.screen,
    disableClickProcessing: true,
  },
});

const convertToDeviceRelatedConfig = params => {
  if (isIOS()) {
    return convertUIConfigForIOS(params);
  }

  if (isAndroid()) {
    return convertUIConfigForAndroid(params);
  }

  return params;
};

export default convertToDeviceRelatedConfig;
