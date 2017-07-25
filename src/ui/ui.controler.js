import { ElementQueries } from 'css-element-queries';

import DependencyContainer from '../core/dependency-container';

import { UI_EVENTS } from '../constants';

import View from './ui.view';

import Screen from './screen/screen.controler';
import Overlay from './overlay/overlay.controler';
import Loader from './loader/loader.controler';
import LoadingCover from './loading-cover/loading-cover.controler';
import ControlsBlock from './controls/controls.controler';


export const DEFAULT_CONFIG = {
  overlay: false,
  loadingCover: false,
  customUI: {}
};

class PlayerUI {
  static dependencies = ['engine', 'eventEmitter', 'rootNode', 'config'];

  constructor({ engine, eventEmitter, config, rootNode }, scope) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this._scope = scope;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config.ui
    };
    this.isHidden = false;

    this._bindCallbacks();
    this._initUI(rootNode);
    this._initComponents();
    this._initCustomUI();

    this._bindEvents();
    ElementQueries.listen();
  }

  get node() {
    return this.view.getNode();
  }

  _bindCallbacks() {
    this._proxyMouseEnter = this._proxyMouseEnter.bind(this);
    this._proxyMouseMove = this._proxyMouseMove.bind(this);
    this._proxyMouseLeave = this._proxyMouseLeave.bind(this);
  }

  _bindEvents() {
    this._eventEmitter.on(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.view.setFullScreenStatus, this.view);
  }

  _unbindEvents() {
    this._eventEmitter.off(UI_EVENTS.FULLSCREEN_STATUS_CHANGED, this.view.setFullScreenStatus, this.view);
  }

  _initUI(rootNode) {
    const { width, height } = this.config;
    const config = {
      rootNode,
      width,
      height,
      callbacks: {
        onMouseEnter: this._proxyMouseEnter,
        onMouseMove: this._proxyMouseMove,
        onMouseLeave: this._proxyMouseLeave
      }
    };

    this.view = new View(config);
  }

  _initComponents() {
    this._scope.register({
      screen: DependencyContainer.asClass(Screen).scoped(),
      overlay: DependencyContainer.asClass(Overlay).scoped(),
      loader: DependencyContainer.asClass(Loader).scoped(),
      loadingCover: DependencyContainer.asClass(LoadingCover).scoped(),
      controls: DependencyContainer.asClass(ControlsBlock).scoped()
    });

    this._screen = this._scope.resolve('screen');

    this._initOverlay();

    this._initLoader();

    this._initLoadingCover();

    this._initControls();

    this.view.appendComponentNode(this._screen.node);
  }

  _initOverlay() {
    const config = this.config.overlay;

    this._overlay = this._scope.resolve('overlay');

    if (config === false) {
      return;
    }
    this.view.appendComponentNode(this._overlay.node);
  }

  _initLoader() {
    this._loader = this._scope.resolve('loader');

    if (this.config.loader === false) {
      return;
    }
    this.view.appendComponentNode(this._loader.node);
  }

  _initLoadingCover() {
    this._loadingCover = this._scope.resolve('loadingCover');

    if (this.config.loadingCover === false) {
      return;
    }

    this.view.appendComponentNode(this._loadingCover.node);
  }

  _initControls() {
    const config = this.config.controls;

    this._controls = this._scope.resolve('controls');

    if (config === false) {
      return;
    }

    this.view.appendComponentNode(this._controls.node);
  }

  _initCustomUI() {
    this.customComponents = {};
    const keys = Object.keys(this.config.customUI);
    keys.forEach(key => {
      const component = new this.config.customUI[key]({
        engine: this._engine,
        eventEmitter: this._eventEmitter,
        ui: this
      });

      this.customComponents[key] = component;

      this.view.appendComponentNode(component.getNode());
    });
  }

  _proxyMouseEnter() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_ENTER_ON_PLAYER_TRIGGERED);
  }

  _proxyMouseMove() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED);
  }

  _proxyMouseLeave() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED);
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  setWidth(width) {
    this.view.setWidth(width);
  }

  setHeight(height) {
    this.view.setHeight(height);
  }

  getWidth() {
    return this.view.getWidth();
  }

  getHeight() {
    return this.view.getHeight();
  }

  setLoadingCover(url) {
    if (this._loadingCover) {
      this._loadingCover.setLoadingCover(url);
    }
  }

  setWatchOnSiteLogo(logo) {
    this._controls.setWatchOnSiteLogo(logo);
  }

  setWatchOnSiteLink(link) {
    this._controls.setWatchOnSiteLink(link);
  }

  setWatchOnSiteAlwaysShowFlag(isShowAlways) {
    this._controls.setWatchOnSiteAlwaysShowFlag(isShowAlways);
  }

  removeWatchOnSite() {
    this._controls.removeWatchOnSite();
  }

  destroy() {
    this._unbindEvents();

    this._controls.destroy();
    delete this._controls;


    this._overlay.destroy();
    delete this._overlay;


    this._loader.destroy();
    delete this._loader;


    this._loadingCover.destroy();
    delete this._loadingCover;


    this._screen.destroy();
    delete this._screen;

    this.view.destroy();
    delete this.view;

    delete this._eventEmitter;
    delete this._engine;
    delete this.config;
  }
}

export default PlayerUI;
