import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import EventEmitter from 'eventemitter3';

import Overlay from './overlay.controler';
import Engine from '../../playback-engine/playback-engine';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';


describe('Overlay', () => {
  let overlay = {};
  let engine = {};
  let eventEmitter = {};
  let eventEmitterSpy = null;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter
    });
  });

  describe('constructor', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter
      });
    });

    it('should create instance ', () => {
      expect(overlay).to.exists;
      expect(overlay.view).to.exists;
    });
  });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter,
        config: {
          poster: 'test'
        }
      });

      eventEmitterSpy = sinon.spy(overlay._eventEmitter, 'emit');
    });

    afterEach(() => {
      overlay._eventEmitter.emit.restore();
    });

    it('should emit ui event on play', () => {
      const callback = sinon.spy(overlay._engine, 'play');

      overlay._playVideo();

      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PLAY_OVERLAY_TRIGGERED)).to.be.true;

      overlay._engine.play.restore();
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter
      });
    });

    it('should react on video playback status changed on play', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      const hideSpy = sinon.spy(overlay, "_hideContent");
      overlay._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, VIDI_PLAYBACK_STATUSES.PLAYING);

      expect(callback.called).to.be.true;
      expect(hideSpy.called).to.be.true;
    })

    it('should react on video playback status changed on end', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      const showSpy = sinon.spy(overlay, "_showContent");
      overlay._bindEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, VIDI_PLAYBACK_STATUSES.ENDED);

      expect(callback.called).to.be.true;
      expect(showSpy.called).to.be.true;
    });


    it('should set hide content state on method call', () => {
      expect(overlay.isContentHidden).to.be.false;
      overlay._hideContent();
      expect(overlay.isContentHidden).to.be.true;
      overlay._showContent();
      expect(overlay.isContentHidden).to.be.false;
    })
  });

  describe('API', () => {
    beforeEach(() => {
      overlay = new Overlay({
        engine,
        eventEmitter
      });
    });

    it('should have method for setting src of background image', () => {
      const src = 'test';
      expect(overlay.setBackgroundSrc).to.exist;
      const cssSpy = sinon.spy(overlay.view.$content, 'css');
      overlay.setBackgroundSrc(src);
      expect(cssSpy.calledWith('background-image', `url('${src}')`)).to.be.true;
    });
  });
});
