import { IThemeService } from '../../core/theme';
import { ITooltipService } from '../../core/tooltip/types';
import { ITextMap } from '../../../text-map/types';

type IVolumeViewStyles = {
  volumeControl: string;
  volumeInputBlock: string;
  isDragging: string;
  muteButton: string;
  icon: string;
  progressBar: string;
  volume: string;
  background: string;
  hitbox: string;
  hidden: string;
};

type IVolumeViewCallbacks = {
  onVolumeLevelChangeFromInput: (level: number) => void;
  onVolumeLevelChangeFromWheel: (delta: number) => void;
  onToggleMuteClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

type IVolumeViewConfig = {
  callbacks: IVolumeViewCallbacks;
  textMap: ITextMap;
  theme: IThemeService;
  tooltipService: ITooltipService;
};

interface IVolumeControl {
  getElement(): HTMLElement;

  show(): void;
  hide(): void;

  destroy(): void;
}

export {
  IVolumeControl,
  IVolumeViewStyles,
  IVolumeViewCallbacks,
  IVolumeViewConfig,
};
