import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';
import { IThemeService } from '../../core/theme';

type ILogoViewStyles = {
  logoWrapper: string;
  logoButton: string;
  logoImage: string;
  hidden: string;
};

type ILogoViewCallbacks = {
  onLogoClick: () => void;
};

type ILogoViewConfig = {
  theme: IThemeService;
  callbacks: ILogoViewCallbacks;
  textMap: ITextMap;
  tooltipService: ITooltipService;
  logo?: string;
};

interface ILogoControl {
  getElement(): HTMLElement;

  setLogo(src: string): void;
  setLogoClickCallback(callback?: () => void): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export { ILogoControl, ILogoViewStyles, ILogoViewConfig, ILogoViewCallbacks };
