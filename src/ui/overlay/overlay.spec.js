import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import $ from 'jbone';
import Vidi from 'vidi';
import EventEmitter from 'eventemitter3';

import Overlay from './overlay.controler';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';


describe('Overlay', () => {
  let overlay = {};
  let $video = {};
  let vidi = {};
  let eventEmitter = {};
  let eventEmitterSpy = null;

  beforeEach(() => {
    $video = new $('<video>', {
      controls: 'true',
    });
    vidi = new Vidi($video[0]);
    eventEmitter = new EventEmitter();
  });

  describe('constructor', () => {
    beforeEach(() => {
      overlay = new Overlay({
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
        vidi,
        eventEmitter
      });

      eventEmitterSpy = sinon.spy(overlay.eventEmitter, 'emit');
    });

    afterEach(() => {
      overlay.eventEmitter.emit.restore();
    });

    it('should emit ui event on play', () => {
      const callback = sinon.spy(overlay.vidi, 'play');

      overlay._playVideo();

      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PLAY_OVERLAY_TRIGGERED)).to.be.true;

      overlay.vidi.play.restore();
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      overlay = new Overlay({
        vidi,
        eventEmitter
      });
    });

    it('should react on play button click', () => {
      const callback = sinon.spy(overlay, "_playVideo");
      overlay._initEvents();
      overlay.view.$playWrapper.trigger('click');

      expect(callback.called).to.be.true;
      expect(overlay.isContentHidden).to.be.true;
    });


    it('should react on video playback status changed on play', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      const hideSpy = sinon.spy(overlay, "_hideContent");
      overlay._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, VIDI_PLAYBACK_STATUSES.PLAYING);

      expect(callback.called).to.be.true;
      expect(hideSpy.called).to.be.true;
    })

    it('should react on video playback status changed on end', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      const showSpy = sinon.spy(overlay, "_showContent");
      overlay._initEvents();

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
        vidi,
        eventEmitter
      });
    });

    it('should have method for showing whole view', () => {
      const showContentSpy = sinon.spy(overlay, '_showContent');
      expect(overlay.show).to.exist;
      overlay.show();
      expect(overlay.isHidden).to.be.false;
      expect(showContentSpy.called).to.be.true;
    });

    it('should have method for hiding whole view', () => {
      const hideContentSpy = sinon.spy(overlay, '_hideContent');
      expect(overlay.hide).to.exist;
      overlay.hide();
      expect(overlay.isHidden).to.be.true;
      expect(hideContentSpy.called).to.be.true;
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
