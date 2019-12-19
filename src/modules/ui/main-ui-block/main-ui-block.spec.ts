import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import { VideoEvent, EngineState } from '../../../constants';

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
    test('should create instance ', () => {
      expect(mainBlock).toBeDefined();
    });
  });

  describe('instance', () => {
    test('should have method for setting playback state', () => {
      expect(mainBlock._updatePlayingState).toBeDefined();

      const startTimeout = sinon.spy(mainBlock, '_startHideBlockTimeout');
      const showTimeout = sinon.spy(mainBlock, '_showContent');

      mainBlock._updatePlayingState({ nextState: EngineState.PLAY_REQUESTED });
      expect(startTimeout.called).toBe(true);
      mainBlock._updatePlayingState({ nextState: EngineState.PAUSED });
      expect(showTimeout.called).toBe(true);
      showTimeout.resetHistory();
      mainBlock._updatePlayingState({ nextState: EngineState.ENDED });
      expect(showTimeout.called).toBe(true);
      showTimeout.resetHistory();
      mainBlock._updatePlayingState({ nextState: EngineState.SRC_SET });
      expect(showTimeout.called).toBe(true);
    });

    test('should have method for hiding controls on timeout', () => {
      const timeoutSpy = sinon.spy(window, 'setTimeout');
      const clearSpy = sinon.spy(window, 'clearTimeout');
      mainBlock._startHideBlockTimeout();
      expect(timeoutSpy.calledWith(mainBlock._tryHideContent, 2000)).toBe(true);
      mainBlock._startHideBlockTimeout();
      expect(clearSpy.called).toBe(true);

      timeoutSpy.restore();
      clearSpy.restore();
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = sinon.spy(mainBlock, '_updatePlayingState');
      mainBlock._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy.called).toBe(true);
    });
  });

  describe('API', () => {
    test('should have method for showing whole view', () => {
      expect(mainBlock.show).toBeDefined();
      mainBlock.show();
      expect(mainBlock.isHidden).toBe(false);
    });

    test('should have method for hiding whole view', () => {
      expect(mainBlock.hide).toBeDefined();
      mainBlock.hide();
      expect(mainBlock.isHidden).toBe(true);
    });
  });
});
