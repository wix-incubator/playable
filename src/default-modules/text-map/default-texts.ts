import { TEXT_LABELS } from '../../constants';


export default {
  [TEXT_LABELS.LOGO_LABEL]: 'Watch On Site',
  [TEXT_LABELS.LOGO_TOOLTIP]: 'Watch On Site',
  [TEXT_LABELS.PAUSE_CONTROL_LABEL]: 'Pause',
  [TEXT_LABELS.PLAY_CONTROL_LABEL]: 'Play',
  [TEXT_LABELS.PROGRESS_CONTROL_LABEL]: 'Progress control',
  [TEXT_LABELS.PROGRESS_CONTROL_VALUE]: ({ percent }) => `Already played ${percent}%`,
  [TEXT_LABELS.MUTE_CONTROL_LABEL]: 'Mute',
  [TEXT_LABELS.UNMUTE_CONTROL_LABEL]: 'Unmute',
  [TEXT_LABELS.VOLUME_CONTROL_LABEL]: 'Volume control',
  [TEXT_LABELS.VOLUME_CONTROL_VALUE]: ({ volume }) => `Volume is ${volume}%`,
  [TEXT_LABELS.ENTER_FULL_SCREEN_LABEL]: 'Enter full screen mode',
  [TEXT_LABELS.EXIT_FULL_SCREEN_LABEL]: 'Exit full screen mode',
};
