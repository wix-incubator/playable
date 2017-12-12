import DependencyContainer from '../core/dependency-container';

import Engine from './playback-engine/playback-engine';
import AnomalyBloodhound from './anomaly-bloodhound/anomaly-bloodhound';
import FullScreenManager from './full-screen-manager/full-screen-manager';
import EventEmitter from './event-emitter/event-emitter';
import TextMap from './text-map/text-map';
import KeyboardInterceptor from './keyboard-control/keyboard-control';
import MouseInterceptor from './mouse-interceptor/mouse-interceptor';
import RootContainer from './root-container/root-container.controler';
import DebugPanel from './ui/debug-panel/debug-panel';

import Title from './ui/title/title';
import LiveIndicator from './ui/live-indicator/live-indicator';
import Screen from './ui/screen/screen.controler';
import Overlay from './ui/overlay/overlay.controler';
import Loader from './ui/loader/loader.controler';
import LoadingCover from './ui/loading-cover/loading-cover.controler';
import ControlsBlock from './ui/controls/controls.controler';
import ManipulationIndicator from './ui/manipulation-indicator/manipulation-indicator.controler';

import ProgressControl from './ui/controls/progress/progress.controler';
import PlayControl from './ui/controls/play/play.controler';
import TimeControl from './ui/controls/time/time.controler';
import VolumeControl from './ui/controls/volume/volume.controler';
import FullScreenControl from './ui/controls/full-screen/full-screen.controler';
import Logo from './ui/controls/logo/logo';

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
  controls: asClass(ControlsBlock).scoped(),
  liveIndicator: asClass(LiveIndicator).scoped(),
  title: asClass(Title).scoped(),

  progressControl: asClass(ProgressControl).scoped(),
  playControl: asClass(PlayControl).scoped(),
  timeControl: asClass(TimeControl).scoped(),
  volumeControl: asClass(VolumeControl).scoped(),
  fullScreenControl: asClass(FullScreenControl).scoped(),

  logo: asClass(Logo).scoped(),
};
