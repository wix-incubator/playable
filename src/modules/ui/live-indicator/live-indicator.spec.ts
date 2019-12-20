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
    test('should create instance ', () => {
      expect(liveIndicator).toBeDefined();
      expect(liveIndicator.view).toBeDefined();
    });
  });

  describe('instance', () => {
    test('should have method for showing/hiding liveIndicator', () => {
      const viewToggleSpy = jest.spyOn(liveIndicator.view, 'toggle');

      // 'hidden by default'
      expect(liveIndicator.isHidden).toBe(true);

      liveIndicator.show();

      expect(viewToggleSpy).toHaveBeenCalledWith(true);
      // 'hidden after method show called'
      expect(liveIndicator.isHidden).toBe(false);

      liveIndicator.hide();

      expect(viewToggleSpy).toHaveBeenLastCalledWith(false);
      // 'hidden after method hide called'
      expect(liveIndicator.isHidden).toBe(true);

      viewToggleSpy.mockRestore();
    });

    test('should have method for getting view node', () => {
      expect(liveIndicator.getElement()).toBe(liveIndicator.view.getElement());
    });

    test('should try to sync with live on click', () => {
      const engineSyncWithLiveSpy = jest.spyOn(engine, 'syncWithLive');
      const liveIndicatorViewNode = liveIndicator.view.getElement();

      liveIndicatorViewNode.dispatchEvent(new Event('click'));

      expect(engineSyncWithLiveSpy).toHaveBeenCalled();

      engineSyncWithLiveSpy.mockRestore();
    });
  });

  describe('on live state change', () => {
    test('should reset on `LiveState.NONE`', async () => {
      const viewToggleSpy = jest.spyOn(liveIndicator.view, 'toggle');
      const viewToggleActiveSpy = jest.spyOn(
        liveIndicator.view,
        'toggleActive',
      );
      const viewToggleEndedSpy = jest.spyOn(liveIndicator.view, 'toggleEnded');

      liveIndicator.show();

      // 'hidden before `LiveState.NONE`'
      expect(liveIndicator.isHidden).toBe(false);

      await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
        nextState: LiveState.NONE,
      });

      // 'isHidden'
      expect(liveIndicator.isHidden).toBe(true);
      // 'view.toggle called with `false`'
      expect(viewToggleSpy).toHaveBeenCalledWith(false);
      // 'view.toggleActive called with `false`'
      expect(viewToggleActiveSpy).toHaveBeenCalledWith(false);
      // 'view.toggleEnded called with `false`'
      expect(viewToggleEndedSpy).toHaveBeenCalledWith(false);

      viewToggleSpy.mockRestore();
      viewToggleActiveSpy.mockRestore();
      viewToggleEndedSpy.mockRestore();
    });

    describe('for dynamic content', () => {
      beforeEach(async () => {
        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.NONE,
        });
      });

      test('should show on `LiveState.INITIAL`', async () => {
        const viewToggleSpy = jest.spyOn(liveIndicator.view, 'toggle');

        // 'hidden before `LiveState.INITIAL`'
        expect(liveIndicator.isHidden).toBe(true);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });

        expect(liveIndicator.isHidden).toBe(false);
        expect(viewToggleSpy).toHaveBeenCalledWith(true);

        viewToggleSpy.mockRestore();
      });

      test('should activate on `LiveState.SYNC`', async () => {
        const viewToggleActiveSpy = jest.spyOn(
          liveIndicator.view,
          'toggleActive',
        );

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });

        // 'hidden before `LiveState.SYNC`'
        expect(liveIndicator.isHidden).toBe(false);
        // 'active before `LiveState.SYNC`'
        expect(liveIndicator.isActive).toBe(false);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        expect(liveIndicator.isActive).toBe(true);
        expect(viewToggleActiveSpy).toHaveBeenCalledWith(true);

        viewToggleActiveSpy.mockRestore();
      });

      test('should deactivate on `LiveState.NOT_SYNC`', async () => {
        const viewToggleActiveSpy = jest.spyOn(
          liveIndicator.view,
          'toggleActive',
        );

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });
        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        // 'active before out of sync'
        expect(liveIndicator.isActive).toBe(true);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.NOT_SYNC,
        });

        expect(liveIndicator.isActive).toBe(false);
        expect(viewToggleActiveSpy).toHaveBeenLastCalledWith(false);

        viewToggleActiveSpy.mockRestore();
      });

      test('should react to `LiveState.ENDED`', async () => {
        const viewToggleActiveSpy = jest.spyOn(
          liveIndicator.view,
          'toggleActive',
        );
        const viewToggleEndedSpy = jest.spyOn(
          liveIndicator.view,
          'toggleEnded',
        );

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });
        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        // 'active before `LiveState.ENDED`'
        expect(liveIndicator.isActive).toBe(true);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.ENDED,
        });

        // 'isActive'
        expect(liveIndicator.isActive).toBe(false);
        // 'view.toggleActive called with `false`'
        expect(viewToggleActiveSpy).toHaveBeenLastCalledWith(false);
        // 'view.toggleEnded called with `true`'
        expect(viewToggleEndedSpy).toHaveBeenLastCalledWith(true);

        viewToggleActiveSpy.mockRestore();
        viewToggleEndedSpy.mockRestore();
      });
    });
  });
});
