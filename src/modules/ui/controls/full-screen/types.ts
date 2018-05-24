import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip';
import { ITextMap } from '../../../text-map/types';

type IFullScreenViewStyles = {
  fullScreenControl: string;
  fullScreenToggle: string;
  icon: string;
  inFullScreen: string;
  hidden: string;
};

type IFullScreenViewCallbacks = {
  onButtonClick: Function;
};

type IFullScreenViewConfig = {
  callbacks: IFullScreenViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

export {
  IFullScreenViewStyles,
  IFullScreenViewCallbacks,
  IFullScreenViewConfig,
};
