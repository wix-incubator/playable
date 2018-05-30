import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
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

interface IFullScreenControl {
  node: HTMLElement;

  setControlStatus(isInFullScreen: boolean): void;

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
