import VideoPlayer from './index';
import HLSAdapter from './adapters/hls';

VideoPlayer.registerPlaybackAdapter(HLSAdapter);

export default VideoPlayer;
export * from './index';
