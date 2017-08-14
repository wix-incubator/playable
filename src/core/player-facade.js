import defaultModules from './default-modules';
import convertParamsToConfig from './config';


export default class Player {
  constructor(rootNode, params, scope, additionalModules) {
    scope.registerValue({
      config: convertParamsToConfig(params),
      rootNode
    });

    this._defaultModules = Object.keys(defaultModules).reduce((modules, moduleName) => {
      modules[moduleName] = scope.resolve(moduleName);
      return modules;
    }, {});

    this._additionalModules = additionalModules.reduce((modules, moduleName) => {
      modules[moduleName] = scope.resolve(moduleName);
      return modules;
    }, {});

    this._config = scope.resolve('config');
    this._rootNode = scope.resolve('rootNode');
  }

  get node() {
    return this._rootNode;
  }

  attachToElement(node) {
    this._defaultModules.ui.attachToElement(node);
  }

  setAutoPlay(isAutoPlay) {
    this._defaultModules.engine.setAutoPlay(isAutoPlay);
  }

  getAutoPlay() {
    return this._defaultModules.engine.getAutoPlay();
  }

  setLoop(isLoop) {
    this._defaultModules.engine.setLoop(isLoop);
  }

  getLoop() {
    return this._defaultModules.engine.getLoop();
  }

  setMute(isMuted) {
    this._defaultModules.engine.setMute(isMuted);
  }

  getMute() {
    return this._defaultModules.engine.getMute();
  }

  setVolume(volume) {
    this._defaultModules.engine.setVolume(volume);
  }

  getVolume() {
    return this._defaultModules.engine.getVolume();
  }

  setPreload(preload) {
    this._defaultModules.engine.setPreload(preload);
  }

  getPreload() {
    return this._defaultModules.engine.getPreload();
  }

  setSrc(src) {
    this._defaultModules.engine.setSrc(src);
  }

  setPlayInline(isPlayInline) {
    this._defaultModules.engine.setPlayInline(isPlayInline);
  }

  getPlayInline() {
    this._defaultModules.engine.getPlayInline();
  }

  play() {
    this._defaultModules.engine.play();
  }

  pause() {
    this._defaultModules.engine.pause();
  }

  on(name, callback) {
    this._defaultModules.eventEmitter.on(name, callback);
  }

  off(name, callback) {
    this._defaultModules.eventEmitter.off(name, callback);
  }

  enterFullScreen() {
    this._defaultModules.fullScreenManager.enterFullScreen();
  }

  exitFullScreen() {
    this._defaultModules.fullScreenManager.exitFullScreen();
  }

  isInFullScreen() {
    return this._defaultModules.fullScreenManager.isInFullScreen;
  }

  show() {
    this._defaultModules.ui.show();
  }

  hide() {
    this._defaultModules.ui.hide();
  }

  setWidth(width) {
    this._defaultModules.ui.setWidth(width);
  }

  getWidth() {
    return this._defaultModules.ui.getWidth();
  }

  setHeight(height) {
    this._defaultModules.ui.setHeight(height);
  }

  getHeight() {
    return this._defaultModules.ui.getHeight();
  }

  setLoadingCover(url) {
    this._defaultModules.ui.setLoadingCover(url);
  }

  setWatchOnSiteLogo(logo) {
    this._defaultModules.ui.setWatchOnSiteLogo(logo);
  }

  setWatchOnSiteAlwaysShowFlag(isShowAlways) {
    this._defaultModules.ui.setWatchOnSiteAlwaysShowFlag(isShowAlways);
  }

  removeWatchOnSite() {
    this._defaultModules.ui.removeWatchOnSite();
  }

  setControlsShouldAlwaysShow(flag) {
    this._defaultModules.ui.setControlsShouldAlwaysShow(flag);
  }

  getDebugInfo() {
   return this._defaultModules.engine.getDebugInfo();
  }

  getCurrentPlaybackState() {
    return this._defaultModules.engine.getCurrentState();
  }

  destroy() {
    Object.keys(this._defaultModules).forEach(moduleName => {
      this._defaultModules[moduleName].destroy();
    });

    Object.keys(this._additionalModules).forEach(moduleName => {
      const module = this._additionalModules[moduleName];

      if (module.destroy) {
        module.destroy();
      }
    });

    delete this._defaultModules;
    delete this._additionalModules;
    delete this._config;
    delete this._rootNode;
  }
}
