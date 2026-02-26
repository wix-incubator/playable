import createPlayerTestkit from '../../../testkit';

import LiveIndicator from './live-indicator';

import { VideoEvent, LiveState } from '../../../constants';

describe('LiveIndicator', () => {
  let testkit;
  let engine: any;
  let eventEmitter: any;
  let liveIndicator: LiveIndicator;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    engine = testkit.getModule('engine');
    eventEmitter = testkit.getModule('eventEmitter');
    liveIndicator = testkit.getModule('liveIndicator');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(liveIndicator).toBeDefined();
      expect(liveIndicator.view).toBeDefined();
    });
  });

  describe('instance', () => {
    it('should have method for showing/hiding liveIndicator', () => {
      const viewToggleSpy = vi.spyOn(liveIndicator.view, 'toggle');

      expect(liveIndicator.isHidden, 'hidden by default').toBe(true);

      liveIndicator.show();

      expect(viewToggleSpy).toHaveBeenCalledWith(true);
      expect(liveIndicator.isHidden).toBe(false);

      liveIndicator.hide();

      expect(viewToggleSpy).toHaveBeenLastCalledWith(false);
      expect(liveIndicator.isHidden).toBe(true);
      viewToggleSpy.mockRestore();
    });

    it('should have method for getting view node', () => {
      expect(liveIndicator.getElement()).toBe(liveIndicator.view.getElement());
    });

    it('should try to sync with live on click', () => {
      const engineSyncWithLiveSpy = vi.spyOn(engine, 'syncWithLive');
      const liveIndicatorViewNode = liveIndicator.view.getElement();

      liveIndicatorViewNode.dispatchEvent(new Event('click'));

      expect(engineSyncWithLiveSpy).toHaveBeenCalled();

      engineSyncWithLiveSpy.mockRestore();
    });
  });

  describe('on live state change', () => {
    it('should reset on `LiveState.NONE`', async function() {
      const viewToggleSpy = vi.spyOn(liveIndicator.view, 'toggle');
      const viewToggleActiveSpy = vi.spyOn(liveIndicator.view, 'toggleActive');
      const viewToggleEndedSpy = vi.spyOn(liveIndicator.view, 'toggleEnded');

      liveIndicator.show();

      expect(liveIndicator.isHidden).toBe(false);

      await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
        nextState: LiveState.NONE,
      });

      expect(liveIndicator.isHidden, 'isHidden').toBe(true);
      expect(viewToggleSpy).toHaveBeenCalledWith(false);
      expect(viewToggleActiveSpy).toHaveBeenCalledWith(false);
      expect(viewToggleEndedSpy).toHaveBeenCalledWith(false);

      viewToggleSpy.mockRestore();
      viewToggleActiveSpy.mockRestore();
      viewToggleEndedSpy.mockRestore();
    });

    describe('for dynamic content', () => {
      beforeEach(async function() {
        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.NONE,
        });
      });

      it('should show on `LiveState.INITIAL`', async function() {
        const viewToggleSpy = vi.spyOn(liveIndicator.view, 'toggle');

        expect(liveIndicator.isHidden).toBe(true);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });

        expect(liveIndicator.isHidden).toBe(false);
        expect(viewToggleSpy).toHaveBeenCalledWith(true);

        viewToggleSpy.mockRestore();
      });

      it('should activate on `LiveState.SYNC`', async function() {
        const viewToggleActiveSpy = vi.spyOn(
          liveIndicator.view,
          'toggleActive',
        );

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });

        expect(liveIndicator.isHidden).toBe(false);
        expect(liveIndicator.isActive).toBe(false);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        expect(liveIndicator.isActive).toBe(true);
        expect(viewToggleActiveSpy).toHaveBeenCalledWith(true);

        viewToggleActiveSpy.mockRestore();
      });

      it('should deactivate on `LiveState.NOT_SYNC`', async function() {
        const viewToggleActiveSpy = vi.spyOn(
          liveIndicator.view,
          'toggleActive',
        );

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });
        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        expect(liveIndicator.isActive, 'active before out of sync').toBe(true);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.NOT_SYNC,
        });

        expect(liveIndicator.isActive).toBe(false);
        expect(viewToggleActiveSpy).toHaveBeenLastCalledWith(false);

        viewToggleActiveSpy.mockRestore();
      });

      it('should react to `LiveState.ENDED`', async function() {
        const viewToggleActiveSpy = vi.spyOn(
          liveIndicator.view,
          'toggleActive',
        );
        const viewToggleEndedSpy = vi.spyOn(liveIndicator.view, 'toggleEnded');

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });
        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        expect(liveIndicator.isActive).toBe(true);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.ENDED,
        });

        expect(liveIndicator.isActive, 'isActive').toBe(false);
        expect(viewToggleActiveSpy).toHaveBeenLastCalledWith(false);
        expect(viewToggleEndedSpy).toHaveBeenLastCalledWith(true);

        viewToggleActiveSpy.mockRestore();
        viewToggleEndedSpy.mockRestore();
      });
    });
  });
});
