import EventEmitter from 'eventemitter3';

import { iPhone, iPod, Android } from './utils/device-detection';

import PlayerUI from './ui/ui.controler';
import Engine from './playback-engine/playback-engine';


class Player {
  constructor(config) {
    this._config = config;

    const {
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
      screen,
      customUI = {}
    } = this._config;

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


    this._createUI(size, controls, overlay, loader, screen, customUI);

    this._engine.setSrc(src);

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }

  _createUI(size, controls, overlay, loader, screen, customUI) {
    const config = {
      ...size,
      overlay,
      screen,
      customUI
    };

    if (iPhone || iPod || Android) {
      config.screen = {
        ...screen,
        disableClickProcessing: true,
        nativeControls: true
      };
      config.loader = false;
      config.controls = false;
    } else {
      config.loader = loader;
      config.controls = controls;
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
    this._engine.setSrc(src);
  }

  on(name, callback) {
    this._eventEmitter.on(name, callback);
  }

  off(name, callback) {
    this._eventEmitter.off(name, callback);
  }

  play() {
    this._engine.play();
  }

  pause() {
    this._engine.pause();
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
}

export default Player;
