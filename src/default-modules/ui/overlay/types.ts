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

export { IOverlayViewStyles, IOverlayViewCallbacks, IOverlayViewConfig };
