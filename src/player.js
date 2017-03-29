import EventEmitter from 'eventemitter3';

import { iPhone, iPod, Android } from './utils/device-detection';

import PlayerUI from './ui/ui.controler';
import Engine from './playback-engine/playback-engine';

class Player {
  constructor({
    preload,
    autoplay,
    loop,
    muted,
    volume,
    src,
    size,
    controls,
    overlay,
    loader,
    customUI = {}
  }) {

    this._eventEmitter = new EventEmitter();
    this._engine = new Engine({
      eventEmitter: this._eventEmitter
    });

    this.setPreload(preload);

    if (autoplay) {
      this.setAutoplay(true);
    }

    if (loop) {
      this.setLoop(true);
    }

    if (muted) {
       this.setMute(true);
    }

    if (volume) {
      this.setVolume(volume);
    }


    this._createUI(size, controls, overlay, loader, customUI);

    this._engine.setSrc(src);
  }

  _createUI(size, controls, overlay, loader, customUI) {
    const config = {
      customUI
    };

    if (size) {
      config.size = size;
    }

    if (controls) {
      config.controls = controls;
    }

    if (iPhone || iPod || Android) {
      config.controls = false;
    }

    if (Android) {
      config.screen = {
        nativeControls: true
      };
    }

    if (overlay) {
      config.overlay = overlay;
    }

    if (loader) {
      config.loader = loader;
    }

    this.ui = new PlayerUI({
      engine: this._engine,
      eventEmitter: this._eventEmitter,
      config
    });
  }

  get node() {
    if (!this.ui) {
      return;
    }

    return this.ui.node;
  }

  setAutoplay(isAutoplay) {
    this._engine.setAutoplay(isAutoplay);
  }

  getAutoplay() {
    return this._engine.getAutoplay();
  }

  setLoop(isLoop) {
    this._engine.setLoop(isLoop);
  }

  getLoop() {
    return this._engine.getLoop();
  }

  setMute(isMuted) {
    this._engine.setMute(isMuted);
  }

  getMute() {
    return this._engine.getMute();
  }

  setVolume(volume) {
    this._engine.setVolume(volume);
  }

  getVolume() {
    return this._engine.getVolume();
  }

  setPreload(preload) {
    this._engine.setPreload(preload);
  }

  getPreload() {
    return this._engine.getPreload();
  }

  setSrc(src) {
    this._engine.pause();
    //TODO: Change this ugly fix on something smarter
    setTimeout(() => {
      this._engine.setSrc(src);
    }, 0);
  }

  on(name, callback) {
    this._eventEmitter.on(name, callback);
  }

  off(name, callback) {
    this._eventEmitter.off(name, callback);
  }

  _unbindAllEvents() {
    const eventsName = this._eventEmitter.eventNames();

    eventsName.forEach(eventName => {
      this._eventEmitter.removeAllListeners(eventName);
    });
  }

  destroy() {
    this.ui.destroy();
    delete this.ui;

    this._unbindAllEvents();
    delete this._eventEmitter;

    this._engine.destroy();
    delete this._engine;
  }

  play() {
    this._engine.play();
  }

  pause() {
    this._engine.pause();
  }
}

export default Player;
