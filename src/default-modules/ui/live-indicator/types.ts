import { ITooltipService } from '../core/tooltip';

type ILiveIndicatorViewStyles = {
  liveIndicatorWrapper: string;
  liveIndicator: string;
  active: string;
  hidden: string;
  ended: string;
};

type ILiveIndicatorViewCallbacks = {
  onClick: Function;
};

type ILiveIndicatorViewConfig = {
  callbacks: ILiveIndicatorViewCallbacks;
  textMap: any;
  tooltipService: ITooltipService;
};

export {
  ILiveIndicatorViewStyles,
  ILiveIndicatorViewCallbacks,
  ILiveIndicatorViewConfig,
};
