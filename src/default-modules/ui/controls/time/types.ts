import { IThemeService } from '../../core/theme';

type ITimeViewStyles = {
  timeWrapper: string;
  time: string;
  current: string;
  separator: string;
  duration: string;
  hidden: string;
};

type ITimeViewConfig = {
  theme: IThemeService;
};

export { ITimeViewStyles, ITimeViewConfig };
