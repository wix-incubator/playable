import { IThemeService } from '../core/theme';

type IOverlayViewStyles = {
  overlay: string;
  poster: string;
  active: string;
  hidden: string;
  transparency: string;
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

interface IOverlayAPI {
  showOverlay?(): void;
  hideOverlay?(): void;
  setPoster?(src: string): void;
}

export {
  IOverlayAPI,
  IOverlay,
  IOverlayViewStyles,
  IOverlayViewCallbacks,
  IOverlayViewConfig,
};
