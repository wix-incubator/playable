import DependencyContainer from './dependency-container';

import RootContainer, {
  IRootContainerAPI,
} from '../modules/root-container/root-container';
import EventEmitter, {
  IEventEmitterAPI,
} from '../modules/event-emitter/event-emitter';
import Engine, {
  IPlaybackEngineAPI,
} from '../modules/playback-engine/playback-engine';
import ThemeService, { IThemeAPI } from '../modules/ui/core/theme';
import TextMap from '../modules/text-map/text-map';

import FullScreenManager, {
  IFullScreenAPI,
} from '../modules/full-screen-manager/full-screen-manager';
import ChromecastManager from '../modules/chromecast-manager/chromecast-manager';

import LiveStateEngine from '../modules/playback-engine/live-state-engine';
import KeyboardControls from '../modules/keyboard-control/keyboard-control';
import DebugPanel from '../modules/ui/debug-panel/debug-panel';

import Screen, { IScreenAPI } from '../modules/ui/screen/screen';
import InteractionIndicator from '../modules/ui/interaction-indicator/interaction-indicator';

import Overlay, { IOverlayAPI } from '../modules/ui/overlay/overlay';
import Loader from '../modules/ui/loader/loader';

import MainUIBlock, {
  IMainUIBlockAPI,
} from '../modules/ui/main-ui-block/main-ui-block';
import TopBlock, { ITopBlockAPI } from '../modules/ui/top-block/top-block';
import Title, { ITitleAPI } from '../modules/ui/title/title';
import LiveIndicator from '../modules/ui/live-indicator/live-indicator';

import BottomBlock, {
  IBottomBlockAPI,
} from '../modules/ui/bottom-block/bottom-block';
import ProgressControl, {
  IProgressControlAPI,
} from '../modules/ui/controls/progress/progress';
import PlayControl from '../modules/ui/controls/play/play';
import TimeControl from '../modules/ui/controls/time/time';
import VolumeControl from '../modules/ui/controls/volume/volume';
import FullScreenControl from '../modules/ui/controls/full-screen/full-screen';
import Logo, { ILogoAPI } from '../modules/ui/controls/logo/logo';
import DownloadButton, {
  IDownloadButtonAPI,
} from '../modules/ui/controls/download/download';
import ChromecaststButton from '../modules/ui/controls/chromecast/chromecast';

import PictureInPictureManager, {
  IPictureInPictureAPI,
} from '../modules/picture-in-picture/picture-in-picture';

import PreviewService, {
  IPreviewAPI,
} from '../modules/ui/preview-service/preview-service';
import PreviewThumbnail from '../modules/ui/preview-thumbnail/preview-thumbnail';
import PreviewFullSize from '../modules/ui/preview-full-size/preview-full-size';

import { TooltipService } from '../modules/ui/core/tooltip';
import NativeOutput from '../modules/playback-engine/output/native/html5video-output';

const { asClass } = DependencyContainer;

export type IPlayer = IRootContainerAPI &
  IEventEmitterAPI &
  IPlaybackEngineAPI &
  IThemeAPI &
  IFullScreenAPI &
  IPictureInPictureAPI &
  IScreenAPI &
  IOverlayAPI &
  IMainUIBlockAPI &
  ITopBlockAPI &
  ITitleAPI &
  IBottomBlockAPI &
  IProgressControlAPI &
  ILogoAPI &
  IDownloadButtonAPI &
  IPreviewAPI;

export const modules: { [id: string]: any } = {
  RootContainer,
  EventEmitter,
  Engine,
  ThemeService,
  TextMap,

  NativeOutput,

  FullScreenManager,
  PictureInPictureManager,
  ChromecastManager,

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
  ChromecaststButton,

  PreviewService,
  PreviewThumbnail,
  PreviewFullSize,

  TooltipService,
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
