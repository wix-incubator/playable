import { TextLabel } from '../../constants';
import { ITextMapConfig } from './types';

const map: ITextMapConfig = {
  [TextLabel.LOGO_LABEL]: 'Watch on site',
  [TextLabel.LOGO_TOOLTIP]: 'Watch On Site',
  [TextLabel.LIVE_INDICATOR_TEXT]: ({ isEnded }) =>
    !isEnded ? 'Live' : 'Live Ended',
  [TextLabel.LIVE_SYNC_LABEL]: 'Sync to live',
  [TextLabel.LIVE_SYNC_TOOLTIP]: 'Sync to Live',
  [TextLabel.PAUSE_CONTROL_LABEL]: 'Pause',
  [TextLabel.PLAY_CONTROL_LABEL]: 'Play',
  [TextLabel.PROGRESS_CONTROL_LABEL]: 'Progress control',
  [TextLabel.PROGRESS_CONTROL_VALUE]: ({ percent }) =>
    `Already played ${percent}%`,
  [TextLabel.MUTE_CONTROL_LABEL]: 'Mute',
  [TextLabel.MUTE_CONTROL_TOOLTIP]: 'Mute',
  [TextLabel.UNMUTE_CONTROL_LABEL]: 'Unmute',
  [TextLabel.UNMUTE_CONTROL_TOOLTIP]: 'Unmute',
  [TextLabel.VOLUME_CONTROL_LABEL]: 'Volume control',
  [TextLabel.VOLUME_CONTROL_VALUE]: ({ volume }) => `Volume is ${volume}%`,
  [TextLabel.ENTER_FULL_SCREEN_LABEL]: 'Enter full screen',
  [TextLabel.ENTER_FULL_SCREEN_TOOLTIP]: 'Enter Full Screen',
  [TextLabel.EXIT_FULL_SCREEN_LABEL]: 'Exit full screen',
  [TextLabel.EXIT_FULL_SCREEN_TOOLTIP]: 'Exit Full Screen',
  [TextLabel.DOWNLOAD_BUTTON_LABEL]: 'Download video',
  [TextLabel.DOWNLOAD_BUTTON_TOOLTIP]: 'Download Video',
  [TextLabel.START_CHROMECAST_BUTTON_LABEL]: 'Broadcast video',
  [TextLabel.START_CHROMECAST_BUTTON_TOOLTIP]: 'Broadcast Video',
  [TextLabel.STOP_CHROMECAST_BUTTON_LABEL]: 'Stop broadcasting video',
  [TextLabel.STOP_CHROMECAST_BUTTON_TOOLTIP]: 'Stop Broadcasting video',
};

export default map;
