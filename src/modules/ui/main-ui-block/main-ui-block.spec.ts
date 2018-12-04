import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import { VIDEO_EVENTS, EngineState } from '../../../constants';

describe('BottomBlock', () => {
  let testkit;
  let mainBlock: any;
  let eventEmitter: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    eventEmitter = testkit.getModule('eventEmitter');
    mainBlock = testkit.getModule('mainUIBlock');
  });
  describe('constructor', () => {
    it('should create instance ', () => {
      expect(mainBlock).to.exist;
    });
  });

  describe('instance', () => {
    it('should have method for setting playback state', () => {
      expect(mainBlock._updatePlayingState).to.exist;

      const startTimeout = sinon.spy(mainBlock, '_startHideBlockTimeout');
      const showTimeout = sinon.spy(mainBlock, '_showContent');

      mainBlock._updatePlayingState({ nextState: EngineState.PLAY_REQUESTED });
      expect(startTimeout.called).to.be.true;
      mainBlock._updatePlayingState({ nextState: EngineState.PAUSED });
      expect(showTimeout.called).to.be.true;
      showTimeout.resetHistory();
      mainBlock._updatePlayingState({ nextState: EngineState.ENDED });
      expect(showTimeout.called).to.be.true;
      showTimeout.resetHistory();
      mainBlock._updatePlayingState({ nextState: EngineState.SRC_SET });
      expect(showTimeout.called).to.be.true;
    });

    it('should have method for hiding controls on timeout', () => {
      const timeoutSpy = sinon.spy(window, 'setTimeout');
      const clearSpy = sinon.spy(window, 'clearTimeout');
      mainBlock._startHideBlockTimeout();
      expect(timeoutSpy.calledWith(mainBlock._tryHideContent, 2000)).to.be.true;
      mainBlock._startHideBlockTimeout();
      expect(clearSpy.called).to.be.true;

      timeoutSpy.restore();
      clearSpy.restore();
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = sinon.spy(mainBlock, '_updatePlayingState');
      mainBlock._bindEvents();
      await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {});
      expect(spy.called).to.be.true;
    });
  });

  describe('API', () => {
    it('should have method for showing whole view', () => {
      expect(mainBlock.show).to.exist;
      mainBlock.show();
      expect(mainBlock.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(mainBlock.hide).to.exist;
      mainBlock.hide();
      expect(mainBlock.isHidden).to.be.true;
    });
  });
});
