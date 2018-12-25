import DependencyContainer from './dependency-container';

import RootContainer from '../modules/root-container/root-container';
import EventEmitter from '../modules/event-emitter/event-emitter';
import Engine from '../modules/playback-engine/playback-engine';
import ThemeService from '../modules/ui/core/theme';
import TextMap from '../modules/text-map/text-map';

import FullScreenManager from '../modules/full-screen-manager/full-screen-manager';

import LiveStateEngine from '../modules/playback-engine/live-state-engine';
import KeyboardControls from '../modules/keyboard-control/keyboard-control';
import DebugPanel from '../modules/ui/debug-panel/debug-panel';

import Screen from '../modules/ui/screen/screen';
import InteractionIndicator from '../modules/ui/interaction-indicator/interaction-indicator';

import Overlay from '../modules/ui/overlay/overlay';
import Loader from '../modules/ui/loader/loader';

import MainUIBlock from '../modules/ui/main-ui-block/main-ui-block';
import TopBlock from '../modules/ui/top-block/top-block';
import Title from '../modules/ui/title/title';
import LiveIndicator from '../modules/ui/live-indicator/live-indicator';

import BottomBlock from '../modules/ui/bottom-block/bottom-block';
import ProgressControl from '../modules/ui/controls/progress/progress';
import PlayControl from '../modules/ui/controls/play/play';
import TimeControl from '../modules/ui/controls/time/time';
import VolumeControl from '../modules/ui/controls/volume/volume';
import FullScreenControl from '../modules/ui/controls/full-screen/full-screen';
import Logo from '../modules/ui/controls/logo/logo';
import DownloadButton from '../modules/ui/controls/download/download';

import PreviewService from '../modules/ui/preview-service/preview-service';
import PreviewThumbnail from '../modules/ui/preview-thumbnail/preview-thumbnail';
import PreviewFullSize from '../modules/ui/preview-full-size/preview-full-size';

import TopButtons from '../modules/ui/top-buttons/top-buttons';

import { TooltipService } from '../modules/ui/core/tooltip';

const { asClass } = DependencyContainer;

export const modules: { [id: string]: any } = {
  RootContainer,
  EventEmitter,
  Engine,
  ThemeService,
  TextMap,

  FullScreenManager,

  LiveStateEngine,
  KeyboardControls,
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
  DownloadButton,

  PreviewService,
  PreviewThumbnail,
  PreviewFullSize,

  TooltipService,

  TopButtons,
};

const DIModules: { [id: string]: any } = Object.keys(modules).reduce(
  (processedModules: { [id: string]: any }, key: string) => {
    const module = modules[key] as any;
    if (!module.moduleName) {
      throw new Error(`No moduleName in module: ${key}`);
    }

    processedModules[module.moduleName] = asClass(module).scoped();
    return processedModules;
  },
  {},
);

export default DIModules;
