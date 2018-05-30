import { ITooltipService } from '../core/tooltip/types';
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

interface ILiveIndicator {
  node: HTMLElement;

  isHidden: boolean;
  isActive: boolean;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  ILiveIndicator,
  ILiveIndicatorViewStyles,
  ILiveIndicatorViewCallbacks,
  ILiveIndicatorViewConfig,
};
