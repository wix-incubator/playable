import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';

type IDownloadViewStyles = {
  downloadButton: string;
  buttonWrapper: string;
  hidden: string;
};

type IDownloadViewCallbacks = {
  onButtonClick: () => void;
};

type IDownloadViewConfig = {
  callbacks: IDownloadViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

interface IDownloadButton {
  getElement(): HTMLElement;

  setDownloadClickCallback(callback: () => void): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

interface IDownloadButtonAPI {
  setDownloadClickCallback?(callback: () => void): void;
}

export {
  IDownloadButtonAPI,
  IDownloadButton,
  IDownloadViewStyles,
  IDownloadViewCallbacks,
  IDownloadViewConfig,
};
