import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import {
  VIDEO_EVENTS,
  UI_EVENTS,
  EngineState,
  LiveState,
} from '../../constants';
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

    sinon.spy(eventEmitter, 'emit');
  });

  afterEach(() => {
    eventEmitter.emit.restore();
  });

  it('should reset state on `STATES.SRC_SET`', async function() {
    const prevState = LiveState.NOT_SYNC;

    liveStateEngine._setState(prevState);

    expect(
      liveStateEngine.state,
      'not `LiveState.NONE` before `SRC_SET`',
    ).to.not.equal(LiveState.NONE);

    await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
      nextState: EngineState.SRC_SET,
    });

    expect(liveStateEngine.state).to.equal(LiveState.NONE);
    expect(
      eventEmitter.emit.lastCall.calledWith(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
        prevState,
        nextState: LiveState.NONE,
      }),
      'new live state emitted',
    ).to.equal(true);
  });

  describe('with dynamic content', () => {
    beforeEach(() => {
      setProperty(engine, 'isDynamicContent', true);
    });

    afterEach(() => {
      resetProperty(engine, 'isDynamicContent');
    });

    it('should set `INITIAL` state on `METADATA_LOADED`', async function() {
      await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: EngineState.SRC_SET,
      });

      expect(
        liveStateEngine.state,
        '`LiveState.NONE` before `METADATA_LOADED`',
      ).to.equal(LiveState.NONE);

      await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: EngineState.METADATA_LOADED,
      });

      expect(liveStateEngine.state).to.equal(LiveState.INITIAL);
      expect(
        eventEmitter.emit.lastCall.calledWith(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          prevState: LiveState.NONE,
          nextState: LiveState.INITIAL,
        }),
        'new live state emitted',
      ).to.equal(true);
    });

    describe('after `INITIAL`', () => {
      beforeEach(async function() {
        await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: EngineState.SRC_SET,
        });
        await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: EngineState.METADATA_LOADED,
        });
      });

      it('should sync to live on `PLAY_REQUESTED`', async function() {
        const syncWithLiveSpy = sinon.stub(engine, 'syncWithLive');

        await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: EngineState.PLAY_REQUESTED,
        });

        expect(syncWithLiveSpy.called).to.equal(true);

        syncWithLiveSpy.restore();
      });

      describe('on `PLAYING`', () => {
        it('should set `SYNC` if `isSyncWithLive`', async function() {
          setProperty(engine, 'isSyncWithLive', true);

          await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(liveStateEngine.state).to.equal(LiveState.SYNC);
          expect(
            eventEmitter.emit.lastCall.calledWith(
              VIDEO_EVENTS.LIVE_STATE_CHANGED,
              {
                prevState: LiveState.INITIAL,
                nextState: LiveState.SYNC,
              },
            ),
            'new live state emitted',
          ).to.equal(true);

          resetProperty(engine, 'isSyncWithLive');
        });

        it('should set `NOT_SYNC` if not `isSyncWithLive`', async function() {
          setProperty(engine, 'isSyncWithLive', false);

          await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(liveStateEngine.state).to.equal(LiveState.NOT_SYNC);
          expect(
            eventEmitter.emit.lastCall.calledWith(
              VIDEO_EVENTS.LIVE_STATE_CHANGED,
              {
                prevState: LiveState.INITIAL,
                nextState: LiveState.NOT_SYNC,
              },
            ),
            'new live state emitted',
          ).to.equal(true);

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

        await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).to.equal(LiveState.SYNC);
        expect(
          eventEmitter.emit.lastCall.calledWith(
            VIDEO_EVENTS.LIVE_STATE_CHANGED,
            {
              prevState: LiveState.NOT_SYNC,
              nextState: LiveState.SYNC,
            },
          ),
          'new live state emitted',
        ).to.equal(true);

        resetProperty(engine, 'isSyncWithLive');
      });

      it('should ignore if not `isSyncWithLive`', async function() {
        setProperty(engine, 'isSyncWithLive', false);

        // reset spy state before test
        eventEmitter.emit.resetHistory();
        await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).to.equal(LiveState.NOT_SYNC);
        // NOTE: ensure emit is not called with new `LiveState`
        expect(eventEmitter.emit.callCount).to.equal(1);

        resetProperty(engine, 'isSyncWithLive');
      });
    });

    describe('on `PLAYING` after seek', () => {
      beforeEach(async function() {
        engine._stateEngine.setState(EngineState.PLAYING);
        liveStateEngine._setState(LiveState.SYNC);

        // emulate seek by UI
        await eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE);
      });

      it('should ignore if `isSyncWithLive`', async function() {
        setProperty(engine, 'isSyncWithLive', true);

        // reset spy state before test
        eventEmitter.emit.resetHistory();
        await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).to.equal(LiveState.SYNC);
        // NOTE: ensure emit is not called with new `LiveState`
        expect(eventEmitter.emit.callCount).to.equal(1);

        resetProperty(engine, 'isSyncWithLive');
      });

      it('should set `NOT_SYNC` if not `isSyncWithLive`', async function() {
        setProperty(engine, 'isSyncWithLive', false);

        await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: EngineState.PLAYING,
        });

        expect(liveStateEngine.state).to.equal(LiveState.NOT_SYNC);
        expect(
          eventEmitter.emit.lastCall.calledWith(
            VIDEO_EVENTS.LIVE_STATE_CHANGED,
            {
              prevState: LiveState.SYNC,
              nextState: LiveState.NOT_SYNC,
            },
          ),
          'new live state emitted',
        ).to.equal(true);

        resetProperty(engine, 'isSyncWithLive');
      });
    });

    it('should set `NOT_SYNC` on `PAUSE` by UI', async function() {
      liveStateEngine._setState(LiveState.SYNC);

      await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        prevState: EngineState.PLAYING,
        nextState: EngineState.PAUSED,
      });

      expect(liveStateEngine.state).to.equal(LiveState.NOT_SYNC);
      expect(
        eventEmitter.emit.lastCall.calledWith(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          prevState: LiveState.SYNC,
          nextState: LiveState.NOT_SYNC,
        }),
        'new live state emitted',
      ).to.equal(true);
    });

    it('should set `ENDED` on stream ended', async function() {
      liveStateEngine._setState(LiveState.SYNC);

      await eventEmitter.emit(VIDEO_EVENTS.DYNAMIC_CONTENT_ENDED);

      expect(liveStateEngine.state).to.equal(LiveState.ENDED);
      expect(
        eventEmitter.emit.lastCall.calledWith(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          prevState: LiveState.SYNC,
          nextState: LiveState.ENDED,
        }),
        'new live state emitted',
      ).to.equal(true);
    });
  });

  it('should ignore events if not `isDynamicContent`', async function() {
    setProperty(engine, 'isDynamicContent', false);

    await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
      nextState: EngineState.SRC_SET,
    });

    expect(
      liveStateEngine.state,
      '`LiveState.NONE` before `METADATA_LOADED`',
    ).to.equal(LiveState.NONE);

    // reset spy state before test
    eventEmitter.emit.resetHistory();
    await eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
      nextState: EngineState.METADATA_LOADED,
    });

    expect(liveStateEngine.state).to.equal(LiveState.NONE);
    // NOTE: ensure emit is not called with new `LiveState`
    expect(eventEmitter.emit.callCount).to.equal(1);

    resetProperty(engine, 'isDynamicContent');
  });
});
