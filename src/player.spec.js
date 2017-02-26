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
      expect(player._$video).to.exists;
      expect(player._vidi).to.exist;
      expect(player.ui).to.exists;
      expect(player.node).to.exists;
      expect(player._eventEmitter).to.exists;
    });

    it('should create separate instances', () => {
      const player2 = new Player({});

      expect(player._$video).to.not.be.equal(player2._$video);
      expect(player._vidi).to.not.be.equal(player2._vidi);
      expect(player.ui).to.not.be.equal(player2.ui);
      expect(player.node).to.not.be.equal(player2.node);
      expect(player._eventEmitter).to.not.be.equal(player2._eventEmitter);
    });
  });

  describe('instance created with extended config', () => {
    it('should set preload to video tag if passed', () => {
      const preload = 'none';
      player = new Player({
        preload
      });
      expect(player._$video.attr('preload')).to.be.equal(preload);
    });

    it('should set autoplay as true to video tag if truthy passed', () => {
      player = new Player({
        autoplay: true
      });
      expect(player._$video[0].autoplay).to.be.true;

      player = new Player({
        autoplay: 'test'
      });
      expect(player._$video[0].autoplay).to.be.true;

      player = new Player({
        autoplay: false
      });
      expect(player._$video[0].autoplay).to.be.false;

      player = new Player({
        autoplay: 0
      });
      expect(player._$video[0].autoplay).to.be.false;
    });

    it('should set loop as true to video tag if truthy passed', () => {
      player = new Player({
        loop: true
      });
      expect(player._$video[0].loop).to.be.true;

      player = new Player({
        loop: 'test'
      });
      expect(player._$video[0].loop).to.be.true;

      player = new Player({
        loop: false
      });
      expect(player._$video[0].loop).to.be.false;

      player = new Player({
        loop: 0
      });
      expect(player._$video[0].loop).to.be.false;
    });

    it('should set muted as true to video tag if truthy passed', () => {
      player = new Player({
        muted: true
      });
      expect(player._$video[0].muted).to.be.true;

      player = new Player({
        muted: 'test'
      });
      expect(player._$video[0].muted).to.be.true;

      player = new Player({
        muted: false
      });
      expect(player._$video[0].muted).to.be.false;

      player = new Player({
        muted: 0
      });
      expect(player._$video[0].muted).to.be.false;
    });

    it('should set volume to video tag if number between 0 and 1 passed', () => {
      player = new Player({
        volume: 0.5
      });
      expect(player._$video[0].volume).to.be.equal(0.5);

      player = new Player({
        volume: '0.3'
      });
      expect(player._$video[0].volume).to.be.equal(0.3);

      player = new Player({
        volume: 'test'
      });
      expect(player._$video[0].volume).to.be.equal(1);

      player = new Player({
        volume: -10
      });
      expect(player._$video[0].volume).to.be.equal(0);
    });

    it('should set src to vidi if passed', () => {
      const src = [
        { url: 'ad.mp4', type: 'mp4' },
        { url: 'ad.mpd', type: 'mpd' }
      ];

      player = new Player({
        src
      });

      expect(player._vidi.src).to.be.equal(src);
    });

    it('should set preload to video tag if passed', () => {
      const preload = "meta";
      player = new Player({
        preload
      });

      expect(player._$video[0].preload).to.be.equal(preload);

      player = new Player({});

      expect(player._$video[0].preload).to.be.equal('auto');
    });
  });

  describe('instance video events proxy', () => {
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
  });

  describe('API', () => {
    beforeEach(() => {
      player = new Player({});
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setAutoplay).to.exist;
      player.setAutoplay(true);
      expect(player._$video[0].autoplay).to.be.true;
      player.setAutoplay(false);
      expect(player._$video[0].autoplay).to.be.false;
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setLoop).to.exist;
      player.setLoop(true);
      expect(player._$video[0].loop).to.be.true;
      player.setLoop(false);
      expect(player._$video[0].loop).to.be.false;
    });

    it('should have method for set autoplay flag', () => {
      expect(player.setMute).to.exist;
      player.setMute(true);
      expect(player._$video[0].muted).to.be.true;
      player.setMute(false);
      expect(player._$video[0].muted).to.be.false;
    });

    it('should have method for set volume', () => {
      expect(player.setVolume).to.exist;
      player.setVolume(0.5);
      expect(player._$video[0].volume).to.be.equal(0.5);
    });

    it('should have method for set preload', () => {
      expect(player.setPreload).to.exist;
      player.setPreload('none');
      expect(player._$video[0].preload).to.be.equal('none');
      player.setPreload(false);
      expect(player._$video[0].preload).to.be.equal('auto');
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
      const playSpy = sinon.spy(player._vidi, 'play');
      player.play();
      expect(playSpy.called).to.be.true;
    });

    it('should have method for stop playback of video', () => {
      expect(player.pause).to.exist;
      const pauseSpy = sinon.spy(player._vidi, 'pause');
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
