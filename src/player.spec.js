import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import Player from './player';
import VIDEO_EVENTS from './constants/events/video';

import eventEmitter from './event-emitter';

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

      it('should set poster to video tag if passed and overlay disabled', () => {
        const poster = 'http://test.const';
        player = new Player({
          overlay: false,
          poster
        });
        expect(player.$video.attr('poster')).to.be.equal(poster);
      });

      it('should set autoplay as true to video tag if truthy passed', () => {
        player = new Player({
          autoplay: true
        });
        expect(player.$video.attr('autoplay')).to.be.equal('true');

        player = new Player({
          autoplay: 'test'
        });
        expect(player.$video.attr('autoplay')).to.be.equal('true');

        player = new Player({
          autoplay: false
        });
        expect(player.$video.attr('autoplay')).to.not.exist;

        player = new Player({
          autoplay: 0
        });
        expect(player.$video.attr('autoplay')).to.not.exist;
      });

      it('should set loop as true to video tag if truthy passed', () => {
        player = new Player({
          loop: true
        });
        expect(player.$video.attr('loop')).to.be.equal('true');

        player = new Player({
          loop: 'test'
        });
        expect(player.$video.attr('loop')).to.be.equal('true');

        player = new Player({
          loop: false
        });
        expect(player.$video.attr('loop')).to.not.exist;

        player = new Player({
          loop: 0
        });
        expect(player.$video.attr('loop')).to.not.exist;
      });

      it('should set muted as true to video tag if truthy passed', () => {
        player = new Player({
          muted: true
        });
        expect(player.$video.attr('muted')).to.be.equal('true');

        player = new Player({
          muted: 'test'
        });
        expect(player.$video.attr('muted')).to.be.equal('true');

        player = new Player({
          muted: false
        });
        expect(player.$video.attr('muted')).to.not.exist;

        player = new Player({
          muted: 0
        });
        expect(player.$video.attr('muted')).to.not.exist;
      });

      it('should set nativeControls as true to video tag if truthy passed and controls disabled', () => {
        player = new Player({
          nativeControls: true,
          controls: false
        });
        expect(player.$video.attr('controls')).to.be.equal('true');

        player = new Player({
          nativeControls: 'test',
          controls: false
        });
        expect(player.$video.attr('controls')).to.be.equal('true');

        player = new Player({
          nativeControls: false
        });
        expect(player.$video.attr('controls')).to.not.exist;

        player = new Player({
          nativeControls: 0
        });
        expect(player.$video.attr('controls')).to.not.exist;
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
  });

  describe('instance video events proxy', () => {
    beforeEach(() => {
      player = new Player({});
      eventEmmiterSpy = sinon.spy(eventEmitter, 'emit');
    });

    afterEach(() => {
      eventEmitter.emit.restore();
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
});
