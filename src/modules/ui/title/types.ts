import { IThemeService } from '../core/theme';

type ITitleViewStyles = {
  title: string;
  link: string;
  hidden: string;
};

type ITitleViewCallbacks = {
  onClick: EventListenerOrEventListenerObject;
};

type ITitleViewConfig = {
  callbacks: ITitleViewCallbacks;
  theme: IThemeService;
};

export { ITitleViewStyles, ITitleViewCallbacks, ITitleViewConfig };
