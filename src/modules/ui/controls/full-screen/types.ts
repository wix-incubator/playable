import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';

type IFullScreenViewStyles = {
  fullScreenControl: string;
  fullScreenToggle: string;
  enterIcon: string;
  exitIcon: string;
  icon: string;
  inFullScreen: string;
  hidden: string;
};

type IFullScreenViewCallbacks = {
  onButtonClick(): void;
};

type IFullScreenViewConfig = {
  callbacks: IFullScreenViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

interface IFullScreenControl {
  getElement(): HTMLElement;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IFullScreenControl,
  IFullScreenViewStyles,
  IFullScreenViewCallbacks,
  IFullScreenViewConfig,
};
