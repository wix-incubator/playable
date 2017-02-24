import VideoPlayer from './player';
import UI_EVENTS from './constants/events/ui';
import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from './constants/events/video';


module.exports = {
  UI_EVENTS,
  VIDEO_EVENTS,
  PLAYBACK_STATUSES: VIDI_PLAYBACK_STATUSES,
  Player: VideoPlayer
};
