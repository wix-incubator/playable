import { isIOS, isAndroid } from '../utils/device-detection';

import { ITextMapConfig } from '../modules/text-map/types';
import {
  PreloadType,
  PlayableMediaSource,
  CrossOriginValue,
} from '../modules/playback-engine/types';

export interface IPlayerConfig {
  src?: PlayableMediaSource;
  poster?: string;
  title?: string;

  width?: number;
  height?: number;
  fillAllSpace?: boolean;
  rtl?: boolean;

  videoElement?: HTMLVideoElement;

  preload?: PreloadType;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playsinline?: boolean;
  crossOrigin?: CrossOriginValue;
  nativeBrowserControls?: boolean;
  preventContextMenu?: boolean;

  disableControlWithClickOnPlayer?: boolean;
  disableControlWithKeyboard?: boolean;

  hideMainUI?: boolean;
  hideOverlay?: boolean;

  disableFullScreen?: boolean;

  texts?: ITextMapConfig;
}

const convertUIConfigForIOS = (params: IPlayerConfig): IPlayerConfig => ({
  ...params,
  disableControlWithClickOnPlayer: true,
  disableControlWithKeyboard: true,
  hideMainUI: true,
  nativeBrowserControls: true,
});

const convertUIConfigForAndroid = (params: IPlayerConfig): IPlayerConfig => ({
  ...params,
  disableControlWithClickOnPlayer: true,
  disableControlWithKeyboard: true,
});

const convertToDeviceRelatedConfig = (params: IPlayerConfig): IPlayerConfig => {
  if (isIOS()) {
    return convertUIConfigForIOS(params);
  }

  if (isAndroid()) {
    return convertUIConfigForAndroid(params);
  }

  return params;
};

export default convertToDeviceRelatedConfig;
