import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import Engine from '../playback-engine/playback-engine';

import EventEmitter from 'eventemitter3';

import create from './player-fabric';


describe('Player', () => {
  let player = {};
  let eventEmitter = {};
  let engine = {};
  let config = {};

  describe('constructor', () => {
    beforeEach(() => {
      config = {};
      eventEmitter = new EventEmitter();
      engine = new Engine({
        eventEmitter,
        config
      });
      player = create({
        engine,
        eventEmitter
      });
    });

    it('should create instance ', () => {
      expect(player).to.exists;
      expect(player._defaultModules.engine).to.exist;
      expect(player._defaultModules.ui).to.exists;
      expect(player.node).to.exists;
      expect(player._defaultModules.eventEmitter).to.exists;
    });

    it('should create separate instances', () => {
      const player2 = create({});

      expect(player._defaultModules.engine).to.not.be.equal(player2._defaultModules.engine);
      expect(player._defaultModules.ui).to.not.be.equal(player2._defaultModules.ui);
      expect(player.node).to.not.be.equal(player2.node);
      expect(player._defaultModules.eventEmitter).to.not.be.equal(player2._defaultModules.eventEmitter);
    });
  });

  describe('API', () => {
    beforeEach(() => {
      player = create({});
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setAutoPlay).to.exist;
      player.setAutoPlay(true);
      expect(player.getAutoPlay()).to.be.true;
      player.setAutoPlay(false);
      expect(player.getAutoPlay()).to.be.false;
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setLoop).to.exist;
      player.setLoop(true);
      expect(player.getLoop()).to.be.true;
      player.setLoop(false);
      expect(player.getLoop()).to.be.false;
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setMute).to.exist;
      player.setMute(true);
      expect(player.getMute()).to.be.true;
      player.setMute(false);
      expect(player.getMute()).to.be.false;
    });

    it('should have method for set volume', () => {
      expect(player.setVolume).to.exist;
      player.setVolume(50);
      expect(player.getVolume()).to.be.equal(50);
    });

    it('should have method for set preload', () => {
      expect(player.setPreload).to.exist;
      player.setPreload('none');
      expect(player.getPreload()).to.be.equal('none');
      player.setPreload(false);
      expect(player.getPreload()).to.be.equal('auto');
    });

    it('should have method for get autoplay flag', () => {
      expect(player.getAutoPlay).to.exist;
      player.setAutoPlay(false);
      expect(player.getAutoPlay()).to.be.false;
    });

    it('should have method for get loop flag', () => {
      expect(player.getLoop).to.exist;
      player.setLoop(false);
      expect(player.getLoop()).to.be.false;
    });

    it('should have method for get mute flag', () => {
      expect(player.getMute).to.exist;
      player.setMute(false);
      expect(player.getMute()).to.be.false;
    });

    it('should have method for get preload', () => {
      const preload = 'metadata';
      expect(player.getPreload).to.exist;
      player.setPreload(preload);
      expect(player.getPreload()).to.be.equal(preload);
    });

    it('should have method for get volume', () => {
      const volume = 30;
      expect(player.getVolume).to.exist;
      player.setVolume(volume);
      expect(player.getVolume()).to.be.equal(volume);
    });

    it('should have method for start playback of video', () => {
      expect(player.play).to.exist;
      const playSpy = sinon.spy(player._defaultModules.engine, 'play');
      player.play();
      expect(playSpy.called).to.be.true;
    });

    it('should have method for stop playback of video', () => {
      expect(player.pause).to.exist;
      const pauseSpy = sinon.spy(player._defaultModules.engine, 'pause');
      player.pause();
      expect(pauseSpy.called).to.be.true;
    });

    it('should have method for destroying player', () => {
      expect(player.destroy).to.exist;
      const uiDestroySpy = sinon.spy(player._defaultModules.ui, 'destroy');

      player.destroy();
      expect(uiDestroySpy.called).to.be.true;
      expect(player.node).to.not.exist;
    });

    it('should have method for setting loading cover', () => {
      expect(player.setLoadingCover);

      const uiLoadingCoverSpy = sinon.spy(player._defaultModules.ui._loadingCover, 'destroy');

    });

    it('should have method for getting loading cover', () => {

    });

    it('should have method for subscribing on events', () => {
      expect(player.on).to.exist;
      const onSpy = sinon.spy(player._defaultModules.eventEmitter, 'on');
      const eventName = 'test';
      const callback = () => {};

      player.on(eventName, callback);
      expect(onSpy.calledWith(eventName, callback)).to.be.true;
    });

    it('should have method for unsubscribing from events', () => {
      expect(player.off).to.exist;
      const offSpy = sinon.spy(player._defaultModules.eventEmitter, 'off');
      const eventName = 'test';
      const callback = () => {};

      player.off(eventName, callback);
      expect(offSpy.calledWith(eventName, callback)).to.be.true;
    });
  });
});
