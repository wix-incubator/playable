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
  src: string;
};

interface IOverlayConfig {
  poster?: string;
}

interface IOverlay {
  node: HTMLElement;

  show(): void;
  hide(): void;

  setPoster(src: string): void;

  destroy(): void;
}

export {
  IOverlay,
  IOverlayConfig,
  IOverlayViewStyles,
  IOverlayViewCallbacks,
  IOverlayViewConfig,
};
