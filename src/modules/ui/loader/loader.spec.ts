import 'jsdom-global/register';
import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import { DELAYED_SHOW_TIMEOUT } from './loader';
import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';

describe('Loader', () => {
  let loader: any;
  let testkit: any;
  let engine: any;
  let eventEmitter: any;
  let emitSpy: any;

  describe('constructor', () => {
    beforeEach(() => {
      testkit = createPlayerTestkit();
    });

    it('should create instance ', () => {
      loader = testkit.getModule('loader');

      expect(loader).to.exist;
      expect(loader.view).to.exist;
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      testkit = createPlayerTestkit();
      loader = testkit.getModule('loader');

      engine = testkit.getModule('engine');
      eventEmitter = testkit.getModule('eventEmitter');

      emitSpy = sinon.spy(eventEmitter, 'emit');
    });

    afterEach(() => {
      eventEmitter.emit.restore();
    });

    describe('public API', () => {
      it('should have method for showing loader', () => {
        const showSpy = sinon.spy(loader.view, 'showContent');
        loader._showContent();
        expect(emitSpy.calledWith(UI_EVENTS.LOADER_SHOW_TRIGGERED)).to.be.true;
        expect(showSpy.called).to.be.true;
        expect(loader.isHidden).to.be.false;
      });

      it('should have method for hiding loader', () => {
        loader._showContent();
        const hideSpy = sinon.spy(loader.view, 'hideContent');
        loader._hideContent();
        expect(emitSpy.calledWith(UI_EVENTS.LOADER_HIDE_TRIGGERED)).to.be.true;
        expect(hideSpy.called).to.be.true;
        expect(loader.isHidden).to.be.true;
      });

      it('should have method for schedule delayed show', () => {
        const setTimeoutSpy = sinon.spy(window, 'setTimeout');

        loader.startDelayedShow();
        expect(
          setTimeoutSpy.calledWith(loader._showContent, DELAYED_SHOW_TIMEOUT),
        ).to.be.true;
        expect(loader.isDelayedShowScheduled).to.be.true;

        setTimeoutSpy.restore();
      });

      it('should have method for unschedule delayed show', () => {
        loader.startDelayedShow();
        const clearTimeoutSpy = sinon.spy(window, 'clearTimeout');

        loader.stopDelayedShow();
        expect(clearTimeoutSpy.called).to.be.true;
        expect(loader.isDelayedShowScheduled).to.be.false;

        clearTimeoutSpy.restore();
      });

      it('should stop previous scheduled show if you trigger schedule', () => {
        const stopSpy = sinon.spy(loader, 'stopDelayedShow');
        loader.startDelayedShow();
        loader.startDelayedShow();
        expect(stopSpy.calledOnce).to.be.true;
      });
    });

    describe('reaction to event', () => {
      it('should be proper if event is VIDEO_EVENTS.UPLOAD_SUSPEND', () => {
        loader.show();
        eventEmitter.emit(VIDEO_EVENTS.UPLOAD_SUSPEND);
        expect(loader.isHidden).to.be.true;
      });

      describe('signifying state change', () => {
        let delayedShowSpy: any;
        let stopDelayedShowSpy: any;

        beforeEach(() => {
          delayedShowSpy = sinon.spy(loader, 'startDelayedShow');
          stopDelayedShowSpy = sinon.spy(loader, 'stopDelayedShow');
        });

        afterEach(() => {
          loader.startDelayedShow.restore();
          loader.stopDelayedShow.restore();
        });

        it('should be proper if next state is EngineState.SEEK_IN_PROGRESS', () => {
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.SEEK_IN_PROGRESS,
          });

          expect(delayedShowSpy.called).to.be.true;
        });

        it('should be proper if next state is EngineState.WAITING', () => {
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(delayedShowSpy.called).to.be.true;
        });

        it('should be proper if next state is EngineState.LOAD_STARTED', () => {
          const showSpy = sinon.spy(loader, '_showContent');
          engine.setPreload('none');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.LOAD_STARTED,
          });

          expect(showSpy.called).to.be.false;

          engine.setPreload('auto');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.LOAD_STARTED,
          });

          expect(showSpy.called).to.be.true;
        });

        it('should be proper if next state is EngineState.READY_TO_PLAY', () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          loader._showContent();
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.READY_TO_PLAY,
          });

          expect(hideSpy.called).to.be.true;
          expect(stopDelayedShowSpy.called).to.be.true;
        });

        it('should be proper if next state is EngineState.PLAYING', () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.PLAYING,
          });

          expect(hideSpy.called).to.be.true;
          expect(stopDelayedShowSpy.called).to.be.true;
        });

        it('should be proper if next state is EngineState.PAUSED', () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.PAUSED,
          });

          expect(hideSpy.called).to.be.true;
          expect(stopDelayedShowSpy.called).to.be.true;
        });
      });
    });
  });
});
