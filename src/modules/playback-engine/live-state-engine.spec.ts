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

    vi.spyOn(eventEmitter, 'emitAsync');
  });

  afterEach(() => {
    eventEmitter.emitAsync.mockRestore();
  });

  it('should reset state on `STATES.SRC_SET`', async function() {
    const prevState = LiveState.NOT_SYNC;

    liveStateEngine._setState(prevState);

    expect(
      liveStateEngine.state,
      'not `LiveState.NONE` before `SRC_SET`',
    ).not.toBe(LiveState.NONE);

    await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
      nextState: EngineState.SRC_SET,
    });

    expect(liveStateEngine.state).toBe(LiveState.NONE);
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

    it('should set `INITIAL` state on `METADATA_LOADED`', async function() {
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.SRC_SET,
      });

      expect(
        liveStateEngine.state,
        '`LiveState.NONE` before `METADATA_LOADED`',
      ).toBe(LiveState.NONE);

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.METADATA_LOADED,
      });

      expect(liveStateEngine.state).toBe(LiveState.INITIAL);
      expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
        VideoEvent.LIVE_STATE_CHANGED,
        {
          prevState: LiveState.NONE,
          nextState: LiveState.INITIAL,
        },
      );
    });

    describe('after `INITIAL`', () => {
      beforeEach(async function() {
        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.SRC_SET,
        });
        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.METADATA_LOADED,
        });
      });

      it('should sync to live on `PLAY_REQUESTED`', async function() {
        const syncWithLiveSpy = vi.spyOn(engine, 'syncWithLive');

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAY_REQUESTED,
        });

        expect(syncWithLiveSpy).toHaveBeenCalled();

        syncWithLiveSpy.mockRestore();
      });

      describe('on `PLAYING`', () => {
        it('should set `SYNC` if `isSyncWithLive`', async function() {
          setProperty(engine, 'isSyncWithLive', true);

          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(liveStateEngine.state).toBe(LiveState.SYNC);
          expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
            VideoEvent.LIVE_STATE_CHANGED,
            {
              prevState: LiveState.INITIAL,
              nextState: LiveState.SYNC,
            },
          );

          resetProperty(engine, 'isSyncWithLive');
        });

        it('should set `NOT_SYNC` if not `isSyncWithLive`', async function() {
          setProperty(engine, 'isSyncWithLive', false);

          await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(liveStateEngine.state).toBe(LiveState.NOT_SYNC);
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

    describe('after `NOT_SYNC` on `PLAYING`', async function() {
      beforeEach(() => {
        liveStateEngine._setState(LiveState.NOT_SYNC);
      });

      it('should set `SYNC` if `isSyncWithLive`', async function() {
        setProperty(engine, 'isSyncWithLive', true);

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).toBe(LiveState.SYNC);
        expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
          VideoEvent.LIVE_STATE_CHANGED,
          {
            prevState: LiveState.NOT_SYNC,
            nextState: LiveState.SYNC,
          },
        );

        resetProperty(engine, 'isSyncWithLive');
      });

      it('should ignore if not `isSyncWithLive`', async function() {
        setProperty(engine, 'isSyncWithLive', false);

        // reset spy state before test
        eventEmitter.emitAsync.mockClear();
        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).toBe(LiveState.NOT_SYNC);
        // NOTE: ensure emit is not called with new `LiveState`
        expect(eventEmitter.emitAsync.mock.calls.length).toBe(1);

        resetProperty(engine, 'isSyncWithLive');
      });
    });

    describe('on `PLAYING` after seek', () => {
      beforeEach(async function() {
        engine._output._stateEngine.setState(EngineState.PLAYING);
        liveStateEngine._setState(LiveState.SYNC);

        // emulate seek by UI
        await eventEmitter.emitAsync(UIEvent.PROGRESS_CHANGE);
      });

      it('should ignore if `isSyncWithLive`', async function() {
        setProperty(engine, 'isSyncWithLive', true);

        // reset spy state before test
        eventEmitter.emitAsync.mockClear();
        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).toBe(LiveState.SYNC);
        // NOTE: ensure emit is not called with new `LiveState`
        expect(eventEmitter.emitAsync.mock.calls.length).toBe(1);

        resetProperty(engine, 'isSyncWithLive');
      });

      it('should set `NOT_SYNC` if not `isSyncWithLive`', async function() {
        setProperty(engine, 'isSyncWithLive', false);

        await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).toBe(LiveState.NOT_SYNC);
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

    it('should set `NOT_SYNC` on `PAUSE` by UI', async function() {
      liveStateEngine._setState(LiveState.SYNC);

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        prevState: EngineState.PLAYING,
        nextState: EngineState.PAUSED,
      });

      expect(liveStateEngine.state).toBe(LiveState.NOT_SYNC);
      expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
        VideoEvent.LIVE_STATE_CHANGED,
        {
          prevState: LiveState.SYNC,
          nextState: LiveState.NOT_SYNC,
        },
      );
    });

    it('should set `ENDED` on stream ended', async function() {
      liveStateEngine._setState(LiveState.SYNC);

      await eventEmitter.emitAsync(VideoEvent.DYNAMIC_CONTENT_ENDED);

      expect(liveStateEngine.state).toBe(LiveState.ENDED);
      expect(eventEmitter.emitAsync).toHaveBeenLastCalledWith(
        VideoEvent.LIVE_STATE_CHANGED,
        {
          prevState: LiveState.SYNC,
          nextState: LiveState.ENDED,
        },
      );
    });
  });

  it('should ignore events if not `isDynamicContent`', async function() {
    setProperty(engine, 'isDynamicContent', false);

    await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
      nextState: EngineState.SRC_SET,
    });

    expect(
      liveStateEngine.state,
      '`LiveState.NONE` before `METADATA_LOADED`',
    ).toBe(LiveState.NONE);

    // reset spy state before test
    eventEmitter.emitAsync.mockClear();
    await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
      nextState: EngineState.METADATA_LOADED,
    });

    expect(liveStateEngine.state).toBe(LiveState.NONE);
    // NOTE: ensure emit is not called with new `LiveState`
    expect(eventEmitter.emitAsync.mock.calls.length).toBe(1);

    resetProperty(engine, 'isDynamicContent');
  });
});
