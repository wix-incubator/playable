import DependencyContainer from '../core/dependency-container';

import Engine from './playback-engine/playback-engine';
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
import TopBlock from './ui/top-block/top-block';
import BottomBlock from './ui/bottom-block/bottom-block';
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
  debugPanel: asClass(DebugPanel).scoped(),

  screen: asClass(Screen).scoped(),
  manipulationIndicator: asClass(ManipulationIndicator).scoped(),

  overlay: asClass(Overlay).scoped(),
  loader: asClass(Loader).scoped(),
  loadingCover: asClass(LoadingCover).scoped(),

  topBlock: asClass(TopBlock).scoped(),
  liveIndicator: asClass(LiveIndicator).scoped(),
  title: asClass(Title).scoped(),

  bottomBlock: asClass(BottomBlock).scoped(),
  progressControl: asClass(ProgressControl).scoped(),
  playControl: asClass(PlayControl).scoped(),
  timeControl: asClass(TimeControl).scoped(),
  volumeControl: asClass(VolumeControl).scoped(),
  fullScreenControl: asClass(FullScreenControl).scoped(),
  logo: asClass(Logo).scoped(),
};
