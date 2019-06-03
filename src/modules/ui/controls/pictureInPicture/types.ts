import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';

type IPictureInPictureViewStyles = {
  pictureInPictureControl: string;
  pictureInPictureToggle: string;
  icon: string;
  pictureInPicture: string;
  hidden: string;
};

type IPictureInPictureViewCallbacks = {
  onButtonClick(): void;
};

type IPictureInPictureViewConfig = {
  callbacks: IPictureInPictureViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

interface IPictureInPictureControl {
  getElement(): HTMLElement;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IPictureInPictureControl,
  IPictureInPictureViewStyles,
  IPictureInPictureViewCallbacks,
  IPictureInPictureViewConfig,
};
