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

      const startTimeout = jest.spyOn(mainBlock, '_startHideBlockTimeout');
      const showTimeout = jest.spyOn(mainBlock, '_showContent');

      mainBlock._updatePlayingState({ nextState: EngineState.PLAY_REQUESTED });
      expect(startTimeout).toHaveBeenCalled();
      mainBlock._updatePlayingState({ nextState: EngineState.PAUSED });
      expect(showTimeout).toHaveBeenCalled();
      showTimeout.mockReset();
      mainBlock._updatePlayingState({ nextState: EngineState.ENDED });
      expect(showTimeout).toHaveBeenCalled();
      showTimeout.mockReset();
      mainBlock._updatePlayingState({ nextState: EngineState.SRC_SET });
      expect(showTimeout).toHaveBeenCalled();
    });

    test('should have method for hiding controls on timeout', () => {
      const timeoutSpy = jest.spyOn(window, 'setTimeout');
      const clearSpy = jest.spyOn(window, 'clearTimeout');
      mainBlock._startHideBlockTimeout();
      expect(timeoutSpy).toHaveBeenCalledWith(mainBlock._tryHideContent, 2000);
      mainBlock._startHideBlockTimeout();
      expect(clearSpy).toHaveBeenCalled();

      timeoutSpy.mockRestore();
      clearSpy.mockRestore();
    });
  });

  describe('video events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = jest.spyOn(mainBlock, '_updatePlayingState');
      mainBlock._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy).toHaveBeenCalled();
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
