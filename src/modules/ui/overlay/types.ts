import { IThemeService } from '../core/theme';

type IOverlayViewStyles = {
  overlay: string;
  poster: string;
  active: string;
  hidden: string;
};

type IOverlayViewCallbacks = {
  onPlayClick: EventListenerOrEventListenerObject;
};

type IOverlayViewConfig = {
  callbacks: IOverlayViewCallbacks;
  theme: IThemeService;
};

interface IOverlay {
  getElement(): HTMLElement;

  show(): void;
  hide(): void;

  setPoster(src: string): void;

  destroy(): void;
}

export {
  IOverlay,
  IOverlayViewStyles,
  IOverlayViewCallbacks,
  IOverlayViewConfig,
};
