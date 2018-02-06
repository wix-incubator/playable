import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip';

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
  textMap: any;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

export {
  IFullScreenViewStyles,
  IFullScreenViewCallbacks,
  IFullScreenViewConfig,
};
