import DependencyContainer from '../core/dependency-container';

import Engine from './playback-engine/playback-engine';
import AnomalyBloodhound from './anomaly-bloodhound/anomaly-bloodhound';
import FullScreenManager from './full-screen-manager/full-screen-manager';
import EventEmitter from './event-emitter/event-emitter';
import TextMap from './text-map/text-map';
import KeyboardInterceptor from './keyboard-control/keyboard-control';
import MouseInterceptor from './mouse-interceptor/mouse-interceptor';
import RootContainer from './root-container/root-container.controler';
import DebugPanel from './debug-panel/debug-panel';

import Screen from './ui/screen/screen.controler';
import Overlay from './ui/overlay/overlay.controler';
import Loader from './ui/loader/loader.controler';
import LoadingCover from './ui/loading-cover/loading-cover.controler';
import ControlsBlock from './ui/controls/controls.controler';
import ManipulationIndicator from './ui/manipulation-indicator/manipulation-indicator.controler';


const { asClass } = DependencyContainer;

export default {
  eventEmitter: asClass(EventEmitter).scoped(),
  rootContainer: asClass(RootContainer).scoped(),
  textMap: asClass(TextMap).scoped(),
  engine: asClass(Engine).scoped(),
  fullScreenManager: asClass(FullScreenManager).scoped(),
  keyboardInterceptor: asClass(KeyboardInterceptor).scoped(),
  mouseInterceptor: asClass(MouseInterceptor).scoped(),
  anomalyBloodhound: asClass(AnomalyBloodhound).scoped(),
  debugPanel: asClass(DebugPanel).scoped(),
  manipulationIndicator: asClass(ManipulationIndicator).scoped(),
  screen: asClass(Screen).scoped(),
  overlay: asClass(Overlay).scoped(),
  loader: asClass(Loader).scoped(),
  loadingCover: asClass(LoadingCover).scoped(),
  controls: asClass(ControlsBlock).scoped()
};
