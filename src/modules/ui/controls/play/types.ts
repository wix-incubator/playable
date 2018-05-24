import { IThemeService } from '../../core/theme';
import { ITextMap } from '../../../text-map/types';

type IPlayViewStyles = {
  playControl: string;
  playbackToggle: string;
  icon: string;
  paused: string;
  hidden: string;
};

type IPlayViewCallbacks = {
  onButtonClick: Function;
};

type IPlayViewConfig = {
  callbacks: IPlayViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
};

export { IPlayViewStyles, IPlayViewCallbacks, IPlayViewConfig };
