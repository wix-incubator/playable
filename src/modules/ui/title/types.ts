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

interface ITitle {
  getElement(): HTMLElement;
  setTitle(title?: string): void;
  setTitleClickCallback(callback?: () => void): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export { ITitle, ITitleViewStyles, ITitleViewCallbacks, ITitleViewConfig };
