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

interface ITitleConfig {
  text?: string;
  callback?: Function;
}

export {
  ITitleConfig,
  ITitleViewStyles,
  ITitleViewCallbacks,
  ITitleViewConfig,
};
