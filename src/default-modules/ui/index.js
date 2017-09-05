import Screen from './screen/screen.controler';
import Overlay from './overlay/overlay.controler';
import Loader from './loader/loader.controler';
import LoadingCover from './loading-cover/loading-cover.controler';
import ControlsBlock from './controls/controls.controler';
import ManipulationIndicator from './manipulation-indicator/manipulation-indicator.controler';
import DependencyContainer from '../../core/dependency-container/index';


export default {
  manipulationIndicator: DependencyContainer.asClass(ManipulationIndicator).scoped(),
  screen: DependencyContainer.asClass(Screen).scoped(),
  overlay: DependencyContainer.asClass(Overlay).scoped(),
  loader: DependencyContainer.asClass(Loader).scoped(),
  loadingCover: DependencyContainer.asClass(LoadingCover).scoped(),
  controls: DependencyContainer.asClass(ControlsBlock).scoped()
};
