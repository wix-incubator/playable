import Playable from './index';
import HLSAdapter from './adapters/hls';
import DASHAdapter from './adapters/dash';

Playable.registerPlaybackAdapter(HLSAdapter);
Playable.registerPlaybackAdapter(DASHAdapter);

export default Playable;
export * from './index';
