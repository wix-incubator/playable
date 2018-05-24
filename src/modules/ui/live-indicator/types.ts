import { ITooltipService } from '../core/tooltip';
import { ITextMap } from '../../text-map/types';

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
  textMap: ITextMap;
  tooltipService: ITooltipService;
};

export {
  ILiveIndicatorViewStyles,
  ILiveIndicatorViewCallbacks,
  ILiveIndicatorViewConfig,
};
