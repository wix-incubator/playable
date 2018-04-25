import { expect } from 'chai';
import * as sinon from 'sinon';

import { VIDEO_EVENTS, UI_EVENTS, STATES, LiveState } from '../../constants';
import createPlayerTestkit, { setProperty, resetProperty } from '../../testkit';

describe('LiveStateEngine', () => {
  let testkit;
  let engine;
  let liveStateEngine;
  let eventEmitter;

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

  it('should reset state on `STATES.SRC_SET`', () => {
    const prevState = LiveState.NOT_SYNC;

    liveStateEngine._setState(prevState);

    expect(
      liveStateEngine.getState(),
      'not `LiveState.NONE` before `SRC_SET`',
    ).to.not.equal(LiveState.NONE);

    eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
      nextState: STATES.SRC_SET,
    });

    expect(liveStateEngine.getState()).to.equal(LiveState.NONE);
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

    it('should set `INITIAL` state on `METADATA_LOADED`', () => {
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: STATES.SRC_SET,
      });

      expect(
        liveStateEngine.getState(),
        '`LiveState.NONE` before `METADATA_LOADED`',
      ).to.equal(LiveState.NONE);

      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: STATES.METADATA_LOADED,
      });

      expect(liveStateEngine.getState()).to.equal(LiveState.INITIAL);
      expect(
        eventEmitter.emit.lastCall.calledWith(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          prevState: LiveState.NONE,
          nextState: LiveState.INITIAL,
        }),
        'new live state emitted',
      ).to.equal(true);
    });

    describe('after `INITIAL`', () => {
      beforeEach(() => {
        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.SRC_SET,
        });
        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.METADATA_LOADED,
        });
      });

      it('should sync to live on `PLAY_REQUESTED`', () => {
        const syncWithLiveSpy = sinon.spy(engine, 'syncWithLive');

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAY_REQUESTED,
        });

        expect(syncWithLiveSpy.called).to.equal(true);

        syncWithLiveSpy.restore();
      });

      describe('on `PLAYING`', () => {
        it('should set `SYNC` if `isSyncWithLive`', () => {
          setProperty(engine, 'isSyncWithLive', true);

          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.PLAYING,
          });

          expect(liveStateEngine.getState()).to.equal(LiveState.SYNC);
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

        it('should set `NOT_SYNC` if not `isSyncWithLive`', () => {
          setProperty(engine, 'isSyncWithLive', false);

          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.PLAYING,
          });

          expect(liveStateEngine.getState()).to.equal(LiveState.NOT_SYNC);
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

    describe('after `NOT_SYNC` on `PLAYING`', () => {
      beforeEach(() => {
        liveStateEngine._setState(LiveState.NOT_SYNC);
      });

      it('should set `SYNC` if `isSyncWithLive`', () => {
        setProperty(engine, 'isSyncWithLive', true);

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAYING,
        });

        expect(liveStateEngine.getState()).to.equal(LiveState.SYNC);
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

      it('should ignore if not `isSyncWithLive`', () => {
        setProperty(engine, 'isSyncWithLive', false);

        // reset spy state before test
        eventEmitter.emit.reset();
        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAYING,
        });

        expect(liveStateEngine.getState()).to.equal(LiveState.NOT_SYNC);
        // NOTE: ensure emit is not called with new `LiveState`
        expect(eventEmitter.emit.callCount).to.equal(1);

        resetProperty(engine, 'isSyncWithLive');
      });
    });

    describe('on `PLAYING` after seek', () => {
      beforeEach(() => {
        engine._stateEngine.setState(STATES.PLAYING);
        liveStateEngine._setState(LiveState.SYNC);

        // emulate seek by UI
        eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE_TRIGGERED);
      });

      it('should ignore if `isSyncWithLive`', () => {
        setProperty(engine, 'isSyncWithLive', true);

        // reset spy state before test
        eventEmitter.emit.reset();
        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAYING,
        });

        expect(liveStateEngine.getState()).to.equal(LiveState.SYNC);
        // NOTE: ensure emit is not called with new `LiveState`
        expect(eventEmitter.emit.callCount).to.equal(1);

        resetProperty(engine, 'isSyncWithLive');
      });

      it('should set `NOT_SYNC` if not `isSyncWithLive`', () => {
        setProperty(engine, 'isSyncWithLive', false);

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAYING,
        });

        expect(liveStateEngine.getState()).to.equal(LiveState.NOT_SYNC);
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

    it('should set `NOT_SYNC` on `PAUSE` by UI', () => {
      liveStateEngine._setState(LiveState.SYNC);

      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        prevState: STATES.PLAYING,
        nextState: STATES.PAUSED,
      });

      expect(liveStateEngine.getState()).to.equal(LiveState.NOT_SYNC);
      expect(
        eventEmitter.emit.lastCall.calledWith(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          prevState: LiveState.SYNC,
          nextState: LiveState.NOT_SYNC,
        }),
        'new live state emitted',
      ).to.equal(true);
    });

    it('should set `ENDED` on stream ended', () => {
      liveStateEngine._setState(LiveState.SYNC);

      eventEmitter.emit(VIDEO_EVENTS.DYNAMIC_CONTENT_ENDED);

      expect(liveStateEngine.getState()).to.equal(LiveState.ENDED);
      expect(
        eventEmitter.emit.lastCall.calledWith(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          prevState: LiveState.SYNC,
          nextState: LiveState.ENDED,
        }),
        'new live state emitted',
      ).to.equal(true);
    });
  });

  it('should ignore events if not `isDynamicContent`', () => {
    setProperty(engine, 'isDynamicContent', false);

    eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
      nextState: STATES.SRC_SET,
    });

    expect(
      liveStateEngine.getState(),
      '`LiveState.NONE` before `METADATA_LOADED`',
    ).to.equal(LiveState.NONE);

    // reset spy state before test
    eventEmitter.emit.reset();
    eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
      nextState: STATES.METADATA_LOADED,
    });

    expect(liveStateEngine.getState()).to.equal(LiveState.NONE);
    // NOTE: ensure emit is not called with new `LiveState`
    expect(eventEmitter.emit.callCount).to.equal(1);

    resetProperty(engine, 'isDynamicContent');
  });
});
