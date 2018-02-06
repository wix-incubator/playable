import { IThemeService } from '../../core/theme';

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
  textMap: any;
  theme: IThemeService;
};

export { IPlayViewStyles, IPlayViewCallbacks, IPlayViewConfig };