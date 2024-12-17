import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
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

type IProgressDragEvents =
  | {
      mouseDown: 'pointerdown';
      mouseMove: 'pointermove';
      mouseOut: 'pointerout';
      mouseUp: 'pointerup';
    }
  | {
      mouseDown: 'touchstart';
      mouseMove: 'touchmove';
      mouseOut: 'mouseout';
      mouseUp: 'touchend';
    }
  | {
      mouseDown: 'mousedown';
      mouseMove: 'mousemove';
      mouseOut: 'mouseout';
      mouseUp: 'mouseup';
    };

type IProgressViewCallbacks = {
  onChangePlayedPercent: (percent: number) => void;
  onSeekToByMouseStart: (percent: number) => void;
  onSeekToByMouseEnd: () => void;
  onSyncWithLiveClick: () => void;
  onSyncWithLiveMouseEnter: EventListenerOrEventListenerObject;
  onSyncWithLiveMouseLeave: EventListenerOrEventListenerObject;
  onDragStart: () => void;
  onDragEnd: () => void;
};

type IProgressViewConfig = {
  callbacks: IProgressViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

interface IProgressControl {
  getElement(): HTMLElement;

  addTimeIndicator(time: number): void;
  addTimeIndicators(times: number[]): void;
  clearTimeIndicators(): void;
  showPreviewOnProgressDrag(): void;
  seekOnProgressDrag(): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

interface IProgressControlAPI {
  addTimeIndicator?(time: number): void;
  addTimeIndicators?(times: number[]): void;
  clearTimeIndicators?(): void;
  showPreviewOnProgressDrag?(): void;
  seekOnProgressDrag?(): void;
}

export {
  IProgressControlAPI,
  IProgressControl,
  IProgressViewStyles,
  IProgressViewCallbacks,
  IProgressViewConfig,
  IProgressDragEvents,
};
