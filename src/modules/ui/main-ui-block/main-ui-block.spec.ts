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
    it('should create instance ', () => {
      expect(mainBlock).toBeDefined();
    });
  });

  describe('instance', () => {
    it('should have method for setting playback state', () => {
      expect(mainBlock._updatePlayingState).toBeDefined();

      const startTimeout = vi.spyOn(mainBlock, '_startHideBlockTimeout');
      const showTimeout = vi.spyOn(mainBlock, '_showContent');

      mainBlock._updatePlayingState({ nextState: EngineState.PLAY_REQUESTED });
      expect(startTimeout).toHaveBeenCalled();
      mainBlock._updatePlayingState({ nextState: EngineState.PAUSED });
      expect(showTimeout).toHaveBeenCalled();
      showTimeout.mockClear();
      mainBlock._updatePlayingState({ nextState: EngineState.ENDED });
      expect(showTimeout).toHaveBeenCalled();
      showTimeout.mockClear();
      mainBlock._updatePlayingState({ nextState: EngineState.SRC_SET });
      expect(showTimeout).toHaveBeenCalled();
    });

    it('should have method for hiding controls on timeout', () => {
      const timeoutSpy = vi.spyOn(window, 'setTimeout');
      const clearSpy = vi.spyOn(window, 'clearTimeout');
      mainBlock._startHideBlockTimeout();
      expect(timeoutSpy).toHaveBeenCalledWith(mainBlock._tryHideContent, 2000);
      mainBlock._startHideBlockTimeout();
      expect(clearSpy).toHaveBeenCalled();

      timeoutSpy.mockRestore();
      clearSpy.mockRestore();
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = vi.spyOn(mainBlock, '_updatePlayingState');
      mainBlock._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('API', () => {
    it('should have method for showing whole view', () => {
      expect(mainBlock.show).toBeDefined();
      mainBlock.show();
      expect(mainBlock.isHidden).toBe(false);
    });

    it('should have method for hiding whole view', () => {
      expect(mainBlock.hide).toBeDefined();
      mainBlock.hide();
      expect(mainBlock.isHidden).toBe(true);
    });
  });
});
