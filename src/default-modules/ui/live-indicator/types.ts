import { ITooltipService } from '../core/tooltip';

type ILiveIndicatorViewStyles = {
  liveIndicator: string;
  liveIndicatorText: string;
  active: string;
  hidden: string;
  ended: string;
};

type ILiveIndicatorViewCallbacks = {
  onClick: EventListenerOrEventListenerObject;
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
