import DependencyContainer from '../core/dependency-container';

import Engine from './playback-engine/playback-engine';
import AnomalyBloodhound from './anomaly-bloodhound/anomaly-bloodhound';
import FullScreenManager from './full-screen-manager/full-screen-manager';
import EventEmitter from './event-emitter/event-emitter';
import TextMap from './text-map/text-map';
import KeyboardInterceptor from './keyboard-control/keyboard-control';
import MouseInterceptor from './mouse-interceptor/mouse-interceptor';
import RootContainer from './root-container/root-container.controler';
import allUI from './ui';

const { asFunction, asClass } = DependencyContainer;

export default {
  eventEmitter: asFunction(EventEmitter).scoped(),
  rootContainer: asClass(RootContainer).scoped(),
  textMap: asClass(TextMap).scoped(),
  engine: asClass(Engine).scoped(),
  fullScreenManager: asClass(FullScreenManager).scoped(),
  keyboardInterceptor: asClass(KeyboardInterceptor).scoped(),
  mouseInterceptor: asClass(MouseInterceptor).scoped(),
  anomalyBloodhound: asClass(AnomalyBloodhound).scoped(),
  ...allUI
};
