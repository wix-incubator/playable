import { TEXT_LABELS } from '../../constants';
import { ITextMapConfig } from './types';

const map: ITextMapConfig = {
  [TEXT_LABELS.LOGO_LABEL]: 'Watch on site',
  [TEXT_LABELS.LOGO_TOOLTIP]: 'Watch On Site',
  [TEXT_LABELS.LIVE_INDICATOR_TEXT]: ({ isEnded }) =>
    !isEnded ? 'Live' : 'Live Ended',
  [TEXT_LABELS.LIVE_SYNC_LABEL]: 'Sync to live',
  [TEXT_LABELS.LIVE_SYNC_TOOLTIP]: 'Sync to Live',
  [TEXT_LABELS.PAUSE_CONTROL_LABEL]: 'Pause',
  [TEXT_LABELS.PLAY_CONTROL_LABEL]: 'Play',
  [TEXT_LABELS.PROGRESS_CONTROL_LABEL]: 'Progress control',
  [TEXT_LABELS.PROGRESS_CONTROL_VALUE]: ({ percent }) =>
    `Already played ${percent}%`,
  [TEXT_LABELS.MUTE_CONTROL_LABEL]: 'Mute',
  [TEXT_LABELS.MUTE_CONTROL_TOOLTIP]: 'Mute',
  [TEXT_LABELS.UNMUTE_CONTROL_LABEL]: 'Unmute',
  [TEXT_LABELS.UNMUTE_CONTROL_TOOLTIP]: 'Unmute',
  [TEXT_LABELS.VOLUME_CONTROL_LABEL]: 'Volume control',
  [TEXT_LABELS.VOLUME_CONTROL_VALUE]: ({ volume }) => `Volume is ${volume}%`,
  [TEXT_LABELS.ENTER_FULL_SCREEN_LABEL]: 'Enter full screen',
  [TEXT_LABELS.ENTER_FULL_SCREEN_TOOLTIP]: 'Enter Full Screen',
  [TEXT_LABELS.EXIT_FULL_SCREEN_LABEL]: 'Exit full screen',
  [TEXT_LABELS.EXIT_FULL_SCREEN_TOOLTIP]: 'Exit Full Screen',
  [TEXT_LABELS.DOWNLOAD_BUTTON_LABEL]: 'Download video',
  [TEXT_LABELS.DOWNLOAD_BUTTON_TOOLTIP]: 'Download Video',
};

export default map;
