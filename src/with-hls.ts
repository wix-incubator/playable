import Playable from './index';
import HLSAdapter from './adapters/hls';

Playable.registerPlaybackAdapter(HLSAdapter);

export default Playable;
export * from './index';
