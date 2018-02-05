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

type ILogoViewOptions = {
  callbacks: ILogoViewCallbacks;
  textMap: any;
  tooltipService: ITooltipService;
  logo?: string;
};

export { ILogoViewStyles, ILogoViewOptions, ILogoViewCallbacks };
