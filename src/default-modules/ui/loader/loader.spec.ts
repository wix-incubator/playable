import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import { DELAYED_SHOW_TIMEOUT } from './loader.controler';
import { VIDEO_EVENTS, UI_EVENTS, STATES } from '../../../constants/index';

describe('Loader', () => {
  let loader;
  let testkit;
  let engine;
  let eventEmitter;
  let emitSpy;

  describe('constructor', () => {
    beforeEach(() => {
      testkit = createPlayerTestkit();
    });

    it('should create instance ', () => {
      loader = testkit.getModule('loader');

      expect(loader).to.exist;
      expect(loader.view).to.exist;
    });

    it('should create instance with custom view if passed', () => {
      const config = {
        loader: {
          view: sinon.spy(() => {
            return {
              getNode: () => {},
              hide: () => {},
              show: () => {},
              hideContent: () => {},
              showContent: () => {},
            };
          }),
        },
      };
      testkit.setConfig(config);

      loader = testkit.getModule('loader');

      expect(config.loader.view.calledWithNew()).to.be.true;
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

      it('should have method for hidding loader', () => {
        loader._showContent();
        const hideSpy = sinon.spy(loader.view, 'hideContent');
        loader._hideContent();
        expect(emitSpy.calledWith(UI_EVENTS.LOADER_HIDE_TRIGGERED)).to.be.true;
        expect(hideSpy.called).to.be.true;
        expect(loader.isHidden).to.be.true;
      });

      it('should have method for schedule delayed show', () => {
        const setTimeoutSpy = sinon.spy(global, 'setTimeout');

        loader.startDelayedShow();
        expect(
          setTimeoutSpy.calledWith(loader._showContent, DELAYED_SHOW_TIMEOUT),
        ).to.be.true;
        expect(loader.isDelayedShowScheduled).to.be.true;

        setTimeoutSpy.restore();
      });

      it('should have method for unschedule delayed show', () => {
        loader.startDelayedShow();
        const clearTimeoutSpy = sinon.spy(global, 'clearTimeout');

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
        let delayedShowSpy;
        let stopDelayedShowSpy;

        beforeEach(() => {
          delayedShowSpy = sinon.spy(loader, 'startDelayedShow');
          stopDelayedShowSpy = sinon.spy(loader, 'stopDelayedShow');
        });

        afterEach(() => {
          loader.startDelayedShow.restore();
          loader.stopDelayedShow.restore();
        });

        it('should be proper if next state is STATES.SEEK_IN_PROGRESS', () => {
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.SEEK_IN_PROGRESS,
          });

          expect(delayedShowSpy.called).to.be.true;
        });

        it('should be proper if next state is STATES.WAITING', () => {
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.WAITING,
          });

          expect(delayedShowSpy.called).to.be.true;
        });

        it('should be proper if next state is STATES.LOAD_STARTED', () => {
          const showSpy = sinon.spy(loader, '_showContent');
          engine.setPreload('none');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.LOAD_STARTED,
          });

          expect(showSpy.called).to.be.false;

          engine.setPreload('auto');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.LOAD_STARTED,
          });

          expect(showSpy.called).to.be.true;
        });

        it('should be proper if next state is STATES.READY_TO_PLAY', () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          loader._showContent();
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.READY_TO_PLAY,
          });

          expect(hideSpy.called).to.be.true;
          expect(stopDelayedShowSpy.called).to.be.true;
        });

        it('should be proper if next state is STATES.PLAYING', () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.PLAYING,
          });

          expect(hideSpy.called).to.be.true;
          expect(stopDelayedShowSpy.called).to.be.true;
        });

        it('should be proper if next state is STATES.PAUSED', () => {
          const hideSpy = sinon.spy(loader, '_hideContent');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: STATES.PAUSED,
          });

          expect(hideSpy.called).to.be.true;
          expect(stopDelayedShowSpy.called).to.be.true;
        });
      });
    });
  });
});
