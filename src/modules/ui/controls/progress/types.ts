import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip';
import { ITextMap } from '../../../text-map/types';

type IProgressViewStyles = {
  seekBlock: string;
  progressBarsWrapper: string;
  progressBar: string;
  background: string;
  buffered: string;
  seekTo: string;
  played: string;
  timeIndicators: string;
  hitbox: string;
  syncButton: string;
  hidden: string;
  inLive: string;
  isDragging: string;
  liveSync: string;
};

type IProgressViewCallbacks = {
  onChangePlayedProgress: Function;
  onSeekToByMouseStart: Function;
  onSeekToByMouseEnd: Function;
  onSyncWithLiveClick: Function;
  onSyncWithLiveMouseEnter: EventListenerOrEventListenerObject;
  onSyncWithLiveMouseLeave: EventListenerOrEventListenerObject;
  onDragStart: Function;
  onDragEnd: Function;
};

type IProgressViewConfig = {
  callbacks: IProgressViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

export { IProgressViewStyles, IProgressViewCallbacks, IProgressViewConfig };
