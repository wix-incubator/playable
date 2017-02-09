import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import $ from 'jbone';
import Vidi from 'vidi';

import Overlay from './overlay.controler';

import VIDEO_EVENTS from '../../constants/events/video';
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
      overlay._playVideo();
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PLAY_OVERLAY_TRIGGERED)).to.be.true;
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


    it('should react on video playback status changes', () => {
      const callback = sinon.spy(overlay, "_updatePlayingStatus");
      overlay._initEvents();

      eventEmitter.emit(VIDEO_EVENTS.PLAYBACK_STATUS_CHANGED);
      expect(callback.called).to.be.true;
    })

    it('should set hide state on method call', () => {
      expect(overlay.isHidden).to.be.false;
      overlay.hideOverlay();
      expect(overlay.isHidden).to.be.true;
      overlay.showOverlay();
      expect(overlay.isHidden).to.be.false;
    })
  });
});
