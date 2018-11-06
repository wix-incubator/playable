import 'jsdom-global/register';

import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';

describe('Overlay', () => {
  let testkit: any;
  let overlay: any = {};
  let eventEmitter: any = {};
  let eventEmitterSpy: any = null;

  beforeEach(() => {
    testkit = createPlayerTestkit();
  });

  describe('constructor', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
    });

    it('should create instance ', () => {
      expect(overlay).to.exist;
      expect(overlay.view).to.exist;
    });
  });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
      eventEmitter = testkit.getModule('eventEmitter');

      eventEmitterSpy = sinon.spy(eventEmitter, 'emit');
    });

    afterEach(() => {
      eventEmitter.emit.restore();
    });

    it('should emit ui event on play', () => {
      const callback = sinon.stub(overlay._engine, 'play');

      overlay._playVideo();

      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UI_EVENTS.PLAY_OVERLAY_CLICK)).to.be
        .true;

      overlay._engine.play.restore();
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
      eventEmitter = testkit.getModule('eventEmitter');
    });

    it('should react on video playback state changed on play', async function() {
      const callback = sinon.spy(overlay, '_updatePlayingState');
      const hideSpy = sinon.spy(overlay, '_hideContent');

      overlay._bindEvents();

      await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: EngineState.PLAY_REQUESTED,
      });

      expect(callback.called).to.be.true;
      expect(hideSpy.called).to.be.true;
    });

    it('should react on video playback state changed on end', async function() {
      const callback = sinon.spy(overlay, '_updatePlayingState');
      const showSpy = sinon.spy(overlay, '_showContent');
      overlay._bindEvents();

      await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: EngineState.ENDED,
      });

      expect(callback.called).to.be.true;
      expect(showSpy.called).to.be.true;
    });
  });
});
