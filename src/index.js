import Vidi from 'vidi';

import VideoPlayer from './player';
import UI_EVENTS from './constants/events/ui';
import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from './constants/events/video';
import DefaultControls from './ui/controls/default-controls';
import Overlay from './ui/overlay/overlay.controler';
import Loader from './ui/loader/loader.controler';


module.exports = {
  DefaultComponents: {
    Overlay,
    Loader
  },
  DefaultControls,
  UI_EVENTS,
  VIDEO_EVENTS,
  PLAYBACK_STATUSES: VIDI_PLAYBACK_STATUSES,
  MediaStreamTypes: Vidi.MediaStreamTypes,
  Player: VideoPlayer
};
