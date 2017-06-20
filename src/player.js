import EventEmitter from 'eventemitter3';

import { iPhone, iPod, Android } from './utils/device-detection';

import PlayerUI from './ui/ui.controler';
import Engine from './playback-engine/playback-engine';
import Logger from './logger/logger';


class Player {
  constructor(config) {
    this._config = config;

    const {
      preload,
      autoPlay,
      loop,
      muted,
      volume,
      src,
      size,
      playInline,
      controls,
      overlay,
      loader,
      logger,
      screen,
      customUI = {}
    } = this._config;

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);

    this._eventEmitter = new EventEmitter();
    this._engine = new Engine({
      eventEmitter: this._eventEmitter
    });

    this._createUI(size, controls, overlay, loader, screen, customUI);

    if (logger) {
      this._logger = new Logger({
        eventEmitter: this._eventEmitter,
        engine: this._engine,
        config: logger
      });
    }

    this.setPreload(preload);

    if (autoPlay) {
      this.setAutoPlay(true);
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

    if (playInline) {
      this.setPlayInline(playInline);
    }

    if (src) {
      this.setSrc(src);
    }
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
        indicateScreenClick: false,
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

  setAutoPlay(isAutoPlay) {
    this._engine.setAutoPlay(isAutoPlay);
  }

  getAutoPlay() {
    return this._engine.getAutoPlay();
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

  setPlayInline(isPlayInline) {
    this._engine.setPlayInline(isPlayInline);
  }

  getPlayInline() {
    this._engine.getPlayInline();
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

    if (this._logger) {
      this._logger.destroy();
      delete this._logger;
    }
  }
}

export default Player;
