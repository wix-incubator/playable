import Playable from './index';
import DASHAdapter from './adapters/dash';

Playable.registerPlaybackAdapter(DASHAdapter);

export default Playable;
export * from './index';
