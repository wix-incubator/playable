import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';

type IChromecastStyles = {
  downloadButton: string;
  buttonWrapper: string;
  hidden: string;
};

type IChromecastViewCallbacks = {
  onButtonClick: Function;
};

type IChromecastViewConfig = {
  callbacks: IChromecastViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

interface IChromecastButton {
  getElement(): HTMLElement;

  setChromecastButtonCallback(callback: Function): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IChromecastButton,
  IChromecastStyles,
  IChromecastViewCallbacks,
  IChromecastViewConfig,
};
