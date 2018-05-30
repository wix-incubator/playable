import 'jsdom-global/register';
import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';
import LoadingCover from './loading-cover';

import { VIDEO_EVENTS, UI_EVENTS, EngineState } from '../../../constants';

describe('LoadingCover', () => {
  let testkit;
  let loadingCover: any;
  let engine: any;
  let eventEmitter: any;
  let emitSpy: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    engine = testkit.getModule('engine');
    eventEmitter = testkit.getModule('eventEmitter');
    testkit.registerModule('loadingCover', LoadingCover);
    loadingCover = testkit.getModule('loadingCover');

    emitSpy = sinon.spy(eventEmitter, 'emit');
  });

  afterEach(() => {
    eventEmitter.emit.restore();
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(loadingCover).to.exist;
      expect(loadingCover.view).to.exist;
    });
  });

  describe('instance', () => {
    describe('public API', () => {
      it('should have method for getting view node', () => {
        const getNodeSpy = sinon.spy(loadingCover.view, 'getNode');
        loadingCover.node;
        expect(getNodeSpy.called).to.be.true;
      });

      it('should have method for setting cover', () => {
        const url = 'url';
        const setCoverSpy = sinon.spy(loadingCover.view, 'setCover');
        loadingCover.setLoadingCover(url);
        expect(setCoverSpy.calledWith(url)).to.be.true;
      });

      it('should have method for showing loader', () => {
        const showSpy = sinon.spy(loadingCover.view, 'show');
        loadingCover.show();
        expect(emitSpy.calledWith(UI_EVENTS.LOADING_COVER_SHOW_TRIGGERED)).to.be
          .true;
        expect(showSpy.called).to.be.true;
        expect(loadingCover.isHidden).to.be.false;
      });

      it('should have method for hidding loader', () => {
        loadingCover.show();
        const hideSpy = sinon.spy(loadingCover.view, 'hide');
        loadingCover.hide();
        expect(emitSpy.calledWith(UI_EVENTS.LOADING_COVER_HIDE_TRIGGERED)).to.be
          .true;
        expect(hideSpy.called).to.be.true;
        expect(loadingCover.isHidden).to.be.true;
      });
    });

    describe('reaction to event', () => {
      it('should be proper if event is VIDEO_EVENTS.UPLOAD_SUSPEND', () => {
        loadingCover.show();
        eventEmitter.emit(VIDEO_EVENTS.UPLOAD_SUSPEND);
        expect(loadingCover.isHidden).to.be.true;
      });

      describe('signifying state change', () => {
        let showSpy: any;
        let hideSpy: any;

        beforeEach(() => {
          showSpy = sinon.spy(loadingCover, 'show');
          hideSpy = sinon.spy(loadingCover, 'hide');
        });

        afterEach(() => {
          loadingCover.show.restore();
          loadingCover.hide.restore();
        });

        it('should be proper if next state is EngineState.LOAD_STARTED', () => {
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

        it('should be proper if next state is EngineState.WAITING', () => {
          engine._stateEngine._isMetadataLoaded = true;
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(showSpy.called).to.be.false;

          engine._stateEngine._isMetadataLoaded = false;
          engine.setPreload('auto');
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.WAITING,
          });

          expect(showSpy.called).to.be.true;
        });

        it('should be proper if next state is EngineState.READY_TO_PLAY', () => {
          eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
            nextState: EngineState.READY_TO_PLAY,
          });

          expect(hideSpy.called).to.be.true;
        });
      });
    });
  });
});
