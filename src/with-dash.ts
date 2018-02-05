import VideoPlayer from './index';
import DASHAdapter from './adapters/dash';

VideoPlayer.registerPlaybackAdapter(DASHAdapter);

export default VideoPlayer;
export * from './index';
