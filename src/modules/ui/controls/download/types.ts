import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';

type IDownloadViewStyles = {
  downloadButton: string;
  buttonWrapper: string;
  hidden: string;
};

type IDownloadViewCallbacks = {
  onButtonClick: Function;
};

type IDownloadViewConfig = {
  callbacks: IDownloadViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

interface IDownloadButton {
  node: HTMLElement;

  setDownloadClickCallback(callback: Function): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IDownloadButton,
  IDownloadViewStyles,
  IDownloadViewCallbacks,
  IDownloadViewConfig,
};
