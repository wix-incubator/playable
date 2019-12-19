import * as sinon from 'sinon';

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
      const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');

      // 'hidden by default'
      expect(liveIndicator.isHidden).toBe(true);

      liveIndicator.show();

      expect(viewToggleSpy.calledWith(true)).toBe(true);
      // 'hidden after method show called'
      expect(liveIndicator.isHidden).toBe(false);

      liveIndicator.hide();

      expect(viewToggleSpy.lastCall.calledWith(false)).toBe(true);
      // 'hidden after method hide called'
      expect(liveIndicator.isHidden).toBe(true);

      viewToggleSpy.restore();
    });

    test('should have method for getting view node', () => {
      expect(liveIndicator.getElement()).toBe(liveIndicator.view.getElement());
    });

    test('should try to sync with live on click', () => {
      const engineSyncWithLiveSpy = sinon.stub(engine, 'syncWithLive');
      const liveIndicatorViewNode = liveIndicator.view.getElement();

      liveIndicatorViewNode.dispatchEvent(new Event('click'));

      expect(engineSyncWithLiveSpy.called).toBe(true);

      engineSyncWithLiveSpy.restore();
    });
  });

  describe('on live state change', () => {
    test('should reset on `LiveState.NONE`', async () => {
      const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');
      const viewToggleActiveSpy = sinon.spy(liveIndicator.view, 'toggleActive');
      const viewToggleEndedSpy = sinon.spy(liveIndicator.view, 'toggleEnded');

      liveIndicator.show();

      // 'hidden before `LiveState.NONE`'
      expect(liveIndicator.isHidden).toBe(false);

      await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
        nextState: LiveState.NONE,
      });

      // 'isHidden'
      expect(liveIndicator.isHidden).toBe(true);
      // 'view.toggle called with `false`'
      expect(viewToggleSpy.calledWith(false)).toBe(true);
      // 'view.toggleActive called with `false`'
      expect(viewToggleActiveSpy.calledWith(false)).toBe(true);
      // 'view.toggleEnded called with `false`'
      expect(viewToggleEndedSpy.calledWith(false)).toBe(true);

      viewToggleSpy.restore();
      viewToggleActiveSpy.restore();
      viewToggleEndedSpy.restore();
    });

    describe('for dynamic content', () => {
      beforeEach(async () => {
        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.NONE,
        });
      });

      test('should show on `LiveState.INITIAL`', async () => {
        const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');

        // 'hidden before `LiveState.INITIAL`'
        expect(liveIndicator.isHidden).toBe(true);

        await eventEmitter.emitAsync(VideoEvent.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });

        expect(liveIndicator.isHidden).toBe(false);
        expect(viewToggleSpy.calledWith(true)).toBe(true);

        viewToggleSpy.restore();
      });

      test('should activate on `LiveState.SYNC`', async () => {
        const viewToggleActiveSpy = sinon.spy(
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
        expect(viewToggleActiveSpy.calledWith(true)).toBe(true);

        viewToggleActiveSpy.restore();
      });

      test('should deactivate on `LiveState.NOT_SYNC`', async () => {
        const viewToggleActiveSpy = sinon.spy(
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
        expect(viewToggleActiveSpy.lastCall.calledWith(false)).toBe(true);

        viewToggleActiveSpy.restore();
      });

      test('should react to `LiveState.ENDED`', async () => {
        const viewToggleActiveSpy = sinon.spy(
          liveIndicator.view,
          'toggleActive',
        );
        const viewToggleEndedSpy = sinon.spy(liveIndicator.view, 'toggleEnded');

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
        expect(viewToggleActiveSpy.lastCall.calledWith(false)).toBe(true);
        // 'view.toggleEnded called with `true`'
        expect(viewToggleEndedSpy.lastCall.calledWith(true)).toBe(true);

        viewToggleActiveSpy.restore();
        viewToggleEndedSpy.restore();
      });
    });
  });
});
