import { ITooltipService } from '../../core/tooltip';

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
  callbacks: ILogoViewCallbacks;
  textMap: any;
  tooltipService: ITooltipService;
  logo?: string;
};

interface ILogoConfig {
  callback?: Function;
  src?: string;
  showAlways?: boolean;
}

export { ILogoConfig, ILogoViewStyles, ILogoViewConfig, ILogoViewCallbacks };
