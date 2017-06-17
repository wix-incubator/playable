import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import Player from './player';


describe('Player', () => {
  let player = {};

  describe('constructor', () => {
    beforeEach(() => {
      player = new Player({});
    });

    it('should create instance ', () => {
      expect(player).to.exists;
      expect(player._engine).to.exist;
      expect(player.ui).to.exists;
      expect(player.node).to.exists;
      expect(player._eventEmitter).to.exists;
    });

    it('should create separate instances', () => {
      const player2 = new Player({});

      expect(player._engine).to.not.be.equal(player2._engine);
      expect(player.ui).to.not.be.equal(player2.ui);
      expect(player.node).to.not.be.equal(player2.node);
      expect(player._eventEmitter).to.not.be.equal(player2._eventEmitter);
    });
  });

  describe('API', () => {
    beforeEach(() => {
      player = new Player({});
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setAutoplay).to.exist;
      player.setAutoplay(true);
      expect(player.getAutoplay()).to.be.true;
      player.setAutoplay(false);
      expect(player.getAutoplay()).to.be.false;
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
      player.setVolume(0.5);
      expect(player.getVolume()).to.be.equal(0.5);
    });

    it('should have method for set preload', () => {
      expect(player.setPreload).to.exist;
      player.setPreload('none');
      expect(player.getPreload()).to.be.equal('none');
      player.setPreload(false);
      expect(player.getPreload()).to.be.equal('auto');
    });

    it('should have method for get autoplay flag', () => {
      expect(player.getAutoplay).to.exist;
      player.setAutoplay(false);
      expect(player.getAutoplay()).to.be.false;
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
      const volume = 0.3;
      expect(player.getVolume).to.exist;
      player.setVolume(volume);
      expect(player.getVolume()).to.be.equal(volume);
    });

    it('should have method for start playback of video', () => {
      expect(player.play).to.exist;
      const playSpy = sinon.spy(player._engine, 'play');
      player.play();
      expect(playSpy.called).to.be.true;
    });

    it('should have method for stop playback of video', () => {
      expect(player.pause).to.exist;
      const pauseSpy = sinon.spy(player._engine, 'pause');
      player.pause();
      expect(pauseSpy.called).to.be.true;
    });

    it('should have method for destroying player', () => {
      expect(player.destroy).to.exist;
      const uiDestroySpy = sinon.spy(player.ui, 'destroy');

      player.destroy();
      expect(uiDestroySpy.called).to.be.true;
      expect(player.node).to.not.exist;
    });

    it('should have method for subscribing on events', () => {
      expect(player.on).to.exist;
      const onSpy = sinon.spy(player._eventEmitter, 'on');
      const eventName = 'test';
      const callback = () => {};

      player.on(eventName, callback);
      expect(onSpy.calledWith(eventName, callback)).to.be.true;
    });

    it('should have method for unsubscribing from events', () => {
      expect(player.off).to.exist;
      const offSpy = sinon.spy(player._eventEmitter, 'off');
      const eventName = 'test';
      const callback = () => {};

      player.off(eventName, callback);
      expect(offSpy.calledWith(eventName, callback)).to.be.true;
    });
  });
});
