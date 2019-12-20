import { VideoEvent, UIEvent, EngineState, LiveState } from '../../constants';
import createPlayerTestkit, { setProperty, resetProperty } from '../../testkit';

describe('LiveStateEngine', () => {
  let testkit;
  let engine: any;
  let liveStateEngine: any;
  let eventEmitter: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    engine = testkit.getModule('engine');
    liveStateEngine = testkit.getModule('liveStateEngine');
    eventEmitter = testkit.getModule('eventEmitter');

    jest.spyOn(eventEmitter, 'emitAsync');
  });

  afterEach(() => {
    eventEmitter.emitAsync.mockRestore();
  });

  test('should reset state on `STATES.SRC_SET`', async () => {
    const prevState = LiveState.NOT_SYNC;

    liveStateEngine._setState(prevState);

    // 'not `LiveState.NONE` before `SRC_SET`'
    expect(liveStateEngine.state).not.toBe(LiveState.NONE);

    await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
      nextState: EngineState.SRC_SET,
    });

    expect(liveStateEngine.state).toBe(LiveState.NONE);
    // 'new live state emitted'
    expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
      VideoEvent.LIVE_STATE_CHANGED,
      {
        prevState,
        nextState: LiveState.NONE,
      },
    );
  });

  describe('with dynamic content', () => {
    beforeEach(() => {
      setProperty(engine, 'isDynamicContent', true);
    });

    afterEach(() => {
      resetProperty(engine, 'isDynamicContent');
    });

    test('should set `INITIAL` state on `METADATA_LOADED`', async () => {
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SRC_SET,
      });

      // '`LiveState.NONE` before `METADATA_LOADED`'
      expect(liveStateEngine.state).toBe(LiveState.NONE);

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.METADATA_LOADED,
      });

      expect(liveStateEngine.state).toBe(LiveState.INITIAL);
      // 'new live state emitted'
      expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
        VideoEvent.LIVE_STATE_CHANGED,
        {
          prevState: LiveState.NONE,
          nextState: LiveState.INITIAL,
        },
      );
    });

    describe('after `INITIAL`', () => {
      beforeEach(async () => {
        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.SRC_SET,
        });
        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.METADATA_LOADED,
        });
      });

      test('should sync to live on `PLAY_REQUESTED`', async () => {
        const syncWithLiveSpy = jest.spyOn(engine, 'syncWithLive');

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAY_REQUESTED,
        });

        expect(syncWithLiveSpy).toHaveBeenCalled();

        syncWithLiveSpy.mockRestore();
      });

      describe('on `PLAYING`', () => {
        test('should set `SYNC` if `isSyncWithLive`', async () => {
          setProperty(engine, 'isSyncWithLive', true);

          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(liveStateEngine.state).toBe(LiveState.SYNC);
          // 'new live state emitted'
          expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
            VideoEvent.LIVE_STATE_CHANGED,
            {
              prevState: LiveState.INITIAL,
              nextState: LiveState.SYNC,
            },
          );

          resetProperty(engine, 'isSyncWithLive');
        });

        test('should set `NOT_SYNC` if not `isSyncWithLive`', async () => {
          setProperty(engine, 'isSyncWithLive', false);

          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(liveStateEngine.state).toBe(LiveState.NOT_SYNC);
          // 'new live state emitted'
          expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
            VideoEvent.LIVE_STATE_CHANGED,
            {
              prevState: LiveState.INITIAL,
              nextState: LiveState.NOT_SYNC,
            },
          );

          resetProperty(engine, 'isSyncWithLive');
        });
      });
    });

    describe('after `NOT_SYNC` on `PLAYING`', () => {
      beforeEach(() => {
        liveStateEngine._setState(LiveState.NOT_SYNC);
      });

      test('should set `SYNC` if `isSyncWithLive`', async () => {
        setProperty(engine, 'isSyncWithLive', true);

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).toBe(LiveState.SYNC);
        // 'new live state emitted'
        expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
          VideoEvent.LIVE_STATE_CHANGED,
          {
            prevState: LiveState.NOT_SYNC,
            nextState: LiveState.SYNC,
          },
        );

        resetProperty(engine, 'isSyncWithLive');
      });

      test('should ignore if not `isSyncWithLive`', async () => {
        setProperty(engine, 'isSyncWithLive', false);

        // reset spy state before test
        eventEmitter.emitAsync.mockReset();
        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).toBe(LiveState.NOT_SYNC);
        // NOTE: ensure emit is not called with new `LiveState`
        expect(eventEmitter.emitAsync).toHaveBeenCalledTimes(1);

        resetProperty(engine, 'isSyncWithLive');
      });
    });

    describe('on `PLAYING` after seek', () => {
      beforeEach(async () => {
        engine._output._stateEngine.setState(EngineState.PLAYING);
        liveStateEngine._setState(LiveState.SYNC);

        // emulate seek by UI
        await eventEmitter.emitAsync(UIEvent.PROGRESS_CHANGE);
      });

      test('should ignore if `isSyncWithLive`', async () => {
        setProperty(engine, 'isSyncWithLive', true);

        // reset spy state before test
        eventEmitter.emitAsync.mockReset();
        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).toBe(LiveState.SYNC);
        // NOTE: ensure emit is not called with new `LiveState`
        expect(eventEmitter.emitAsync).toHaveBeenCalledTimes(1);

        resetProperty(engine, 'isSyncWithLive');
      });

      test('should set `NOT_SYNC` if not `isSyncWithLive`', async () => {
        setProperty(engine, 'isSyncWithLive', false);

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).toBe(LiveState.NOT_SYNC);
        // 'new live state emitted'
        expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
          VideoEvent.LIVE_STATE_CHANGED,
          {
            prevState: LiveState.SYNC,
            nextState: LiveState.NOT_SYNC,
          },
        );

        resetProperty(engine, 'isSyncWithLive');
      });
    });

    test('should set `NOT_SYNC` on `PAUSE` by UI', async () => {
      liveStateEngine._setState(LiveState.SYNC);

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        prevState: EngineState.PLAYING,
        nextState: EngineState.PAUSED,
      });

      expect(liveStateEngine.state).toBe(LiveState.NOT_SYNC);
      // 'new live state emitted'
      expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
        VideoEvent.LIVE_STATE_CHANGED,
        {
          prevState: LiveState.SYNC,
          nextState: LiveState.NOT_SYNC,
        },
      );
    });

    test('should set `ENDED` on stream ended', async () => {
      liveStateEngine._setState(LiveState.SYNC);

      await eventEmitter.emitAsync(VideoEvent.DYNAMIC_CONTENT_ENDED);

      expect(liveStateEngine.state).toBe(LiveState.ENDED);
      // 'new live state emitted'
      expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
        VideoEvent.LIVE_STATE_CHANGED,
        {
          prevState: LiveState.SYNC,
          nextState: LiveState.ENDED,
        },
      );
    });
  });

  test('should ignore events if not `isDynamicContent`', async () => {
    setProperty(engine, 'isDynamicContent', false);

    await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
      nextState: EngineState.SRC_SET,
    });

    // '`LiveState.NONE` before `METADATA_LOADED`'
    expect(liveStateEngine.state).toBe(LiveState.NONE);

    // reset spy state before test
    eventEmitter.emitAsync.mockReset();
    await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
      nextState: EngineState.METADATA_LOADED,
    });

    expect(liveStateEngine.state).toBe(LiveState.NONE);
    // NOTE: ensure emit is not called with new `LiveState`
    expect(eventEmitter.emitAsync).toHaveBeenCalledTimes(1);

    resetProperty(engine, 'isDynamicContent');
  });
});
