import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import $ from 'jbone';
import Vidi from 'vidi';

import Overlay from './overlay.controler';

import VIDEO_EVENTS, { VIDI_PLAYBACK_STATUSES } from '../../constants/events/video';
import UI_EVENTS from '../../constants/events/ui';

import eventEmitter from '../../event-emitter';

describe('VolumeControl', () => {
  let overlay = {};
  let $video = {};
  let vidi = {};
  let eventEmitterSpy = null;

  beforeEach(() => {
    $video = new $('<video>', {
      controls: 'true',
    });
    vidi = new Vidi($video[0]);
  });

  describe('constructor', () => {
    beforeEach(() => {
      overlay = new Overlay({});
    });

    it('should create instance ', () => {
      expect(overlay).to.exists;
      expect(overlay.view).to.exists;
    });
  });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      overlay = new Overlay({
        vidi
      });

      eventEmitterSpy = sinon.spy(eventEmitter, 'emit');
    });

    afterEach(() => {
      eventEmitter.emit.restore();
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
        vidi
      });
    });

    it('should react on play button click', () => {
      const callback = sinon.spy(overlay, "_playVideo");
      overlay._initEvents();
      overlay.view.$playWrapper.trigger('click');

      expect(callback.called).to.be.true;
      expect(overlay.isHidden).to.be.true;
    });


    it('should react on video playback status changed on play', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      const hideSpy = sinon.spy(overlay, "hideOverlay");
      overlay._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, VIDI_PLAYBACK_STATUSES.PLAYING);

      expect(callback.called).to.be.true;
      expect(hideSpy.called).to.be.true;
    })

    it('should react on video playback status changed on end', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      const showSpy = sinon.spy(overlay, "showOverlay");
      overlay._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED, VIDI_PLAYBACK_STATUSES.ENDED);

      expect(callback.called).to.be.true;
      expect(showSpy.called).to.be.true;
    });


    it('should set hide state on method call', () => {
      expect(overlay.isHidden).to.be.false;
      overlay.hideOverlay();
      expect(overlay.isHidden).to.be.true;
      overlay.showOverlay();
      expect(overlay.isHidden).to.be.false;
    })
  });
});
