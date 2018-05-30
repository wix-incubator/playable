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

interface ITitle {
  node: HTMLElement;
  setTitle(title?: string): void;
  setTitleClickCallback(callback?: Function): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  ITitle,
  ITitleConfig,
  ITitleViewStyles,
  ITitleViewCallbacks,
  ITitleViewConfig,
};
