import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';
import { IThemeService } from '../../core/theme';

type ILogoViewStyles = {
  logoWrapper: string;
  logoPlaceholder: string;
  companyLogo: string;
  link: string;
  hidden: string;
};

type ILogoViewCallbacks = {
  onLogoClick: Function;
};

type ILogoViewConfig = {
  theme: IThemeService;
  callbacks: ILogoViewCallbacks;
  textMap: ITextMap;
  tooltipService: ITooltipService;
  logo?: string;
};

interface ILogoConfig {
  callback?: Function;
  src?: string;
  showAlways?: boolean;
}

interface ILogoControl {
  node: HTMLElement;

  setLogo(src: string): void;
  setLogoClickCallback(callback?: Function): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  ILogoControl,
  ILogoConfig,
  ILogoViewStyles,
  ILogoViewConfig,
  ILogoViewCallbacks,
};
