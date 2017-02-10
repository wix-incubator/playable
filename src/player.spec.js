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
      expect(player.$video).to.exists;
      expect(player.vidi).to.exist;
      expect(player.ui).to.exists;
      expect(player.node).to.exists;
      expect(player.eventEmitter).to.exists;
    });

    it('should create separate instances', () => {
      const player2 = new Player({});

      expect(player.$video).to.not.be.equal(player2.$video);
      expect(player.vidi).to.not.be.equal(player2.vidi);
      expect(player.ui).to.not.be.equal(player2.ui);
      expect(player.node).to.not.be.equal(player2.node);
      expect(player.eventEmitter).to.not.be.equal(player2.eventEmitter);
    });
  });

  describe('instance created with extended config', () => {
    it('should set width to video tag if passed', () => {
      const width = '500';
      player = new Player({
        width
      });
      expect(player.$video.attr('width')).to.be.equal(width);
    });

    it('should set height to video tag if passed', () => {
      const height = '500';
      player = new Player({
        height
      });
      expect(player.$video.attr('height')).to.be.equal(height);
    });

    it('should set preload to video tag if passed', () => {
      const preload = 'none';
      player = new Player({
        preload
      });
      expect(player.$video.attr('preload')).to.be.equal(preload);
    });

    it('should set autoplay as true to video tag if truthy passed', () => {
      player = new Player({
        autoplay: true
      });
      expect(player.$video[0].autoplay).to.be.true;

      player = new Player({
        autoplay: 'test'
      });
      expect(player.$video[0].autoplay).to.be.true;

      player = new Player({
        autoplay: false
      });
      expect(player.$video[0].autoplay).to.be.false;

      player = new Player({
        autoplay: 0
      });
      expect(player.$video[0].autoplay).to.be.false;
    });

    it('should set loop as true to video tag if truthy passed', () => {
      player = new Player({
        loop: true
      });
      expect(player.$video[0].loop).to.be.true;

      player = new Player({
        loop: 'test'
      });
      expect(player.$video[0].loop).to.be.true;

      player = new Player({
        loop: false
      });
      expect(player.$video[0].loop).to.be.false;

      player = new Player({
        loop: 0
      });
      expect(player.$video[0].loop).to.be.false;
    });

    it('should set muted as true to video tag if truthy passed', () => {
      player = new Player({
        muted: true
      });
      expect(player.$video[0].muted).to.be.true;

      player = new Player({
        muted: 'test'
      });
      expect(player.$video[0].muted).to.be.true;

      player = new Player({
        muted: false
      });
      expect(player.$video[0].muted).to.be.false;

      player = new Player({
        muted: 0
      });
      expect(player.$video[0].muted).to.be.false;
    });

    it('should set volume to video tag if number between 0 and 1 passed', () => {
      player = new Player({
        volume: 0.5
      });
      expect(player.$video[0].volume).to.be.equal(0.5);

      player = new Player({
        volume: '0.3'
      });
      expect(player.$video[0].volume).to.be.equal(0.3);

      player = new Player({
        volume: 'test'
      });
      expect(player.$video[0].volume).to.be.equal(1);

      player = new Player({
        volume: -10
      });
      expect(player.$video[0].volume).to.be.equal(0);
    });

    it('should set src to vidi if passed', () => {
      const src = [
        { url: 'ad.mp4', type: 'mp4' },
        { url: 'ad.mpd', type: 'mpd' }
      ];

      player = new Player({
        src
      });

      expect(player.vidi.src).to.be.equal(src);
    });
  });

  describe('instance video events proxy', () => {
    beforeEach(() => {
      player = new Player({});
      eventEmmiterSpy = sinon.spy(player.eventEmitter, 'emit');
    });

    afterEach(() => {
      player.eventEmitter.emit.restore();
    });

    it('should react on statuschange', () => {
      player.vidi.emit('statuschange');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED)).to.be.true;
    });

    it('should react on loadstart', () => {
      player.vidi.emit('loadstart');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.LOAD_STARTED)).to.be.true;
    });

    it('should react on durationchange', () => {
      player.vidi.emit('durationchange');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.DURATION_UPDATED)).to.be.true;
    });

    it('should react on timeupdate', () => {
      player.vidi.emit('timeupdate');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.CURRENT_TIME_UPDATED)).to.be.true;
    });

    it('should react on loadedmetadata', () => {
      player.$video.trigger('loadedmetadata');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.METADATA_LOADED)).to.be.true;
    });

    it('should react on progress', () => {
      player.$video.trigger('progress');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.CHUNK_LOADED)).to.be.true;
    });

    it('should react on seeking', () => {
      player.$video.trigger('seeking');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.SEEK_STARTED)).to.be.true;
    });

    it('should react on seeked', () => {
      player.$video.trigger('seeked');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.SEEK_ENDED)).to.be.true;
    });

    it('should react on volumechange', () => {
      player.$video.trigger('volumechange');
      expect(eventEmmiterSpy.calledWith(VIDEO_EVENTS.VOLUME_STATUS_CHANGED)).to.be.true;
    });
  })

  describe('API', () => {
    beforeEach(() => {
      player = new Player({});
    });

    it('shoul have method for set autoplay flag', () => {
      expect(player.setAutoplay).to.exist;
      player.setAutoplay(true);
      expect(player.$video[0].autoplay).to.be.true;
      player.setAutoplay(false);
      expect(player.$video[0].autoplay).to.be.false;
    });

    it('shoul have method for set autoplay flag', () => {
      expect(player.setLoop).to.exist;
      player.setLoop(true);
      expect(player.$video[0].loop).to.be.true;
      player.setLoop(false);
      expect(player.$video[0].loop).to.be.false;
    });

    it('shoul have method for set autoplay flag', () => {
      expect(player.setMute).to.exist;
      player.setMute(true);
      expect(player.$video[0].muted).to.be.true;
      player.setMute(false);
      expect(player.$video[0].muted).to.be.false;
    });

    it('shoul have method for showing controls', () => {
      expect(player.showControls).to.exist;
      const showSpy = sinon.spy(player.ui, 'showControls');
      player.showControls();
      expect(showSpy.called).to.be.true;
    });

    it('shoul have method for hiding controls', () => {
      expect(player.hideControls).to.exist;
      const hideSpy = sinon.spy(player.ui, 'hideControls');
      player.hideControls();
      expect(hideSpy.called).to.be.true;
    });

    it('shoul have method for showing overlay', () => {
      expect(player.showOverlay).to.exist;
      const showSpy = sinon.spy(player.ui, 'showOverlay');
      player.showOverlay();
      expect(showSpy.called).to.be.true;
    });

    it('shoul have method for hiding overlay', () => {
      expect(player.hideOverlay).to.exist;
      const hideSpy = sinon.spy(player.ui, 'hideOverlay');
      player.hideOverlay();
      expect(hideSpy.called).to.be.true;
    });

    it('shoul have method for setting width', () => {
      expect(player.setWidth).to.exist;
      const setWidthSpy = sinon.spy(player.ui, 'setWidth');

      player.setWidth(10);
      expect(setWidthSpy.called).to.be.true;
      expect(player.$video.attr('width')).to.be.equal('10');

      player.setWidth('20');
      expect(player.$video.attr('width')).to.be.equal('20');
    });

    it('shoul have method for setting height', () => {
      expect(player.setHeight).to.exist;
      const setHeightSpy = sinon.spy(player.ui, 'setHeight');

      player.setHeight(10);
      expect(setHeightSpy.called).to.be.true;
      expect(player.$video.attr('height')).to.be.equal('10');

      player.setHeight('20');
      expect(player.$video.attr('height')).to.be.equal('20');
    });
  });
});
