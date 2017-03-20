import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import Player from './player';
import VIDEO_EVENTS from './constants/events/video';


describe('Player', () => {
  let player = {};
  let eventEmmiterSpy = null;

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

  /* describe('instance video events proxy', () => {
    beforeEach(() => {
      player = new Player({});
      eventEmmiterSpy = sinon.spy(player._eventEmitter, 'emit');
    });

    afterEach(() => {
      player._eventEmitter.emit.restore();
    });

    it('should react on statuschange', () => {
      player._vidi.emit('statuschange');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED)).to.be.true;
    });

    it('should react on loadstart', () => {
      player._vidi.emit('loadstart');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.LOAD_STARTED)).to.be.true;
    });

    it('should react on durationchange', () => {
      player._vidi.emit('durationchange');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.DURATION_UPDATED)).to.be.true;
    });

    it('should react on timeupdate', () => {
      player._vidi.emit('timeupdate');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.CURRENT_TIME_UPDATED)).to.be.true;
    });

    it('should react on loadedmetadata', () => {
      player._$video.trigger('loadedmetadata');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.METADATA_LOADED)).to.be.true;
    });

    it('should react on progress', () => {
      player._$video.trigger('progress');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.CHUNK_LOADED)).to.be.true;
    });

    it('should react on seeking', () => {
      player._$video.trigger('seeking');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.SEEK_STARTED)).to.be.true;
    });

    it('should react on seeked', () => {
      player._$video.trigger('seeked');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.SEEK_ENDED)).to.be.true;
    });

    it('should react on volumechange', () => {
      player._$video.trigger('volumechange');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.VOLUME_STATUS_CHANGED)).to.be.true;
    });
  }); */

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
