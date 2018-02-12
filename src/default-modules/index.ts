import DependencyContainer from '../core/dependency-container';

import ThemeService from './ui/core/theme';

import Engine from './playback-engine/playback-engine';
import LiveStateEngine from './playback-engine/live-state-engine';
import FullScreenManager from './full-screen-manager/full-screen-manager';
import EventEmitter from './event-emitter/event-emitter';
import TextMap from './text-map/text-map';
import KeyboardInterceptor from './keyboard-control/keyboard-control';
import MouseInterceptor from './mouse-interceptor/mouse-interceptor';
import RootContainer from './root-container/root-container';
import DebugPanel from './ui/debug-panel/debug-panel';

import MainUIBlock from './ui/main-ui-block/main-ui-block';

import Title from './ui/title/title';
import LiveIndicator from './ui/live-indicator/live-indicator';
import Screen from './ui/screen/screen';
import Overlay from './ui/overlay/overlay';
import Loader from './ui/loader/loader';
import TopBlock from './ui/top-block/top-block';
import BottomBlock from './ui/bottom-block/bottom-block';
import InteractionIndicator from './ui/interaction-indicator/interaction-indicator';

import ProgressControl from './ui/controls/progress/progress';
import PlayControl from './ui/controls/play/play';
import TimeControl from './ui/controls/time/time';
import VolumeControl from './ui/controls/volume/volume';
import FullScreenControl from './ui/controls/full-screen/full-screen';
import Logo from './ui/controls/logo/logo';

import { TooltipService } from './ui/core/tooltip';

const { asClass } = DependencyContainer;

export const modules = {
  EventEmitter,
  TooltipService,
  RootContainer,
  TextMap,
  Engine,
  LiveStateEngine,
  FullScreenManager,
  KeyboardInterceptor,
  MouseInterceptor,
  DebugPanel,

  Screen,
  InteractionIndicator,

  Overlay,
  Loader,

  MainUIBlock,

  TopBlock,
  LiveIndicator,
  Title,

  BottomBlock,
  ProgressControl,
  PlayControl,
  TimeControl,
  VolumeControl,
  FullScreenControl,
  Logo,

  ThemeService,
};

const DIModules = Object.keys(modules).reduce((DIModules, key) => {
  const module = modules[key];
  if (!module.moduleName) {
    throw new Error(`No moduleName in module: ${key}`);
  }

  DIModules[module.moduleName] = asClass(module).scoped();
  return DIModules;
}, {});

export default DIModules;
