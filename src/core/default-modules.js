import DependencyContainer from './dependency-container';

import PlayerUI from '../ui/ui.controler';
import Engine from '../playback-engine/playback-engine';
import AnomalyBloodhound from '../anomaly-bloodhound/anomaly-bloodhound';
import FullScreenManager from '../full-screen-manager/full-screen-manager';
import EventEmitter from '../event-emitter/event-emitter';

const { asFunction, asClass } = DependencyContainer;

export default {
  eventEmitter: asFunction(EventEmitter).scoped(),
  engine: asClass(Engine).scoped(),
  fullScreenManager: asClass(FullScreenManager).scoped(),
  ui: asClass(PlayerUI).scoped(),
  anomalyBloodhound: asClass(AnomalyBloodhound).scoped()
};
