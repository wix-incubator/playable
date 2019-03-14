import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';

type IChromecaststStyles = {
  downloadButton: string;
  buttonWrapper: string;
  hidden: string;
};

type IChromecaststViewCallbacks = {
  onButtonClick: Function;
};

type IChromecaststViewConfig = {
  callbacks: IChromecaststViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

interface IChromecaststButton {
  getElement(): HTMLElement;

  setChromecaststButtonCallback(callback: Function): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IChromecaststButton,
  IChromecaststStyles,
  IChromecaststViewCallbacks,
  IChromecaststViewConfig,
};
