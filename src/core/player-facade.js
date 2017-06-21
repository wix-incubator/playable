import defaultModules from './default-modules';
import convertParamsToConfig from './config';


export default class Player {
  constructor(params, scope, additionalModules) {
    scope.registerValue({
      config: convertParamsToConfig(params)
    });

    this._defaultModules = Object.keys(defaultModules).reduce((modules, moduleName) => {
      modules[moduleName] = scope.resolve(moduleName);
      return modules;
    }, {});

    this._additionalModules = additionalModules.reduce((modules, moduleName) => {
      modules[moduleName] = scope.resolve(moduleName);
      return modules;
    }, {});
  }

  get node() {
    if (!(this._defaultModules && this._defaultModules.ui)) {
      return;
    }

    return this._defaultModules.ui.node;
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

  setHeight(height) {
    this._defaultModules.ui.setHeight(height);
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
  }
}
