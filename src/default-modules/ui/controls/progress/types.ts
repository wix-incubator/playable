import { ITooltipService } from '../../core/tooltip';

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
  onDragStart: Function;
  onDragEnd: Function;
};

type IProgressViewOptions = {
  callbacks: IProgressViewCallbacks;
  textMap: any;
  tooltipService: ITooltipService;
};

export { IProgressViewStyles, IProgressViewCallbacks, IProgressViewOptions };
