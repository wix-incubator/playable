import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import LiveIndicator from './live-indicator';

import { describe } from 'selenium-webdriver/testing';
import { VIDEO_EVENTS, LiveState } from '../../../constants';

describe('LiveIndicator', () => {
  let testkit;
  let engine;
  let eventEmitter;
  let liveIndicator: LiveIndicator;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    engine = testkit.getModule('engine');
    eventEmitter = testkit.getModule('eventEmitter');
    liveIndicator = testkit.getModule('liveIndicator');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(liveIndicator).to.exist;
      expect(liveIndicator.view).to.exist;
    });
  });

  describe('instance', () => {
    it('should have method for showing/hiding liveIndicator', () => {
      const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');

      expect(liveIndicator.isHidden, 'hidden by default').to.be.true;

      liveIndicator.show();

      expect(viewToggleSpy.calledWith(true)).to.be.true;
      expect(liveIndicator.isHidden, 'hidden after method show called').to.be
        .false;

      liveIndicator.hide();

      expect(viewToggleSpy.lastCall.calledWith(false)).to.be.true;
      expect(liveIndicator.isHidden, 'hidden after method hide called').to.be
        .true;

      viewToggleSpy.restore();
    });

    it('should have method for getting view node', () => {
      expect(liveIndicator.node).to.equal(liveIndicator.view.getNode());
    });

    it('should try to sync with live on click', () => {
      const engineSyncWithLiveSpy = sinon.spy(engine, 'syncWithLive');

      liveIndicator.view.$liveIndicator.trigger('click');

      expect(engineSyncWithLiveSpy.called).to.be.true;

      engineSyncWithLiveSpy.restore();
    });
  });

  describe('on live state change', () => {
    it('should reset on `LiveState.NONE`', () => {
      const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');
      const viewToggleActiveSpy = sinon.spy(liveIndicator.view, 'toggleActive');
      const viewToggleEndedSpy = sinon.spy(liveIndicator.view, 'toggleEnded');

      liveIndicator.show();

      expect(liveIndicator.isHidden, 'hidden before `LiveState.NONE`').to.be
        .false;

      eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
        nextState: LiveState.NONE,
      });

      expect(liveIndicator.isHidden, 'isHidden').to.be.true;
      expect(viewToggleSpy.calledWith(false), 'view.toggle called with `false`')
        .to.be.true;
      expect(
        viewToggleActiveSpy.calledWith(false),
        'view.toggleActive called with `false`',
      ).to.be.true;
      expect(
        viewToggleEndedSpy.calledWith(false),
        'view.toggleEnded called with `false`',
      ).to.be.true;

      viewToggleSpy.restore();
      viewToggleActiveSpy.restore();
      viewToggleEndedSpy.restore();
    });

    describe('for dynamic content', () => {
      beforeEach(() => {
        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.NONE,
        });
      });

      it('should show on `LiveState.INITIAL`', () => {
        const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');

        expect(liveIndicator.isHidden, 'hidden before `LiveState.INITIAL`').to
          .be.true;

        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });

        expect(liveIndicator.isHidden).to.be.false;
        expect(viewToggleSpy.calledWith(true)).to.be.true;

        viewToggleSpy.restore();
      });

      it('should activate on `LiveState.SYNC`', () => {
        const viewToggleActiveSpy = sinon.spy(
          liveIndicator.view,
          'toggleActive',
        );

        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });

        expect(liveIndicator.isHidden, 'hidden before `LiveState.SYNC`').to.be
          .false;
        expect(liveIndicator.isActive, 'active before `LiveState.SYNC`').to.be
          .false;

        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        expect(liveIndicator.isActive).to.be.true;
        expect(viewToggleActiveSpy.calledWith(true)).to.be.true;

        viewToggleActiveSpy.restore();
      });

      it('should deactivate on `LiveState.NOT_SYNC`', () => {
        const viewToggleActiveSpy = sinon.spy(
          liveIndicator.view,
          'toggleActive',
        );

        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });
        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        expect(liveIndicator.isActive, 'active before out of sync').to.be.true;

        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.NOT_SYNC,
        });

        expect(liveIndicator.isActive).to.be.false;
        expect(viewToggleActiveSpy.lastCall.calledWith(false)).to.be.true;

        viewToggleActiveSpy.restore();
      });

      it('should react to `LiveState.ENDED`', () => {
        const viewToggleActiveSpy = sinon.spy(
          liveIndicator.view,
          'toggleActive',
        );
        const viewToggleEndedSpy = sinon.spy(liveIndicator.view, 'toggleEnded');

        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.INITIAL,
        });
        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.SYNC,
        });

        expect(liveIndicator.isActive, 'active before `LiveState.ENDED`').to.be
          .true;

        eventEmitter.emit(VIDEO_EVENTS.LIVE_STATE_CHANGED, {
          nextState: LiveState.ENDED,
        });

        expect(liveIndicator.isActive, 'isActive').to.be.false;
        expect(
          viewToggleActiveSpy.lastCall.calledWith(false),
          'view.toggleActive called with `false`',
        ).to.be.true;
        expect(
          viewToggleEndedSpy.lastCall.calledWith(true),
          'view.toggleEnded called with `true`',
        ).to.be.true;

        viewToggleActiveSpy.restore();
        viewToggleEndedSpy.restore();
      });
    });
  });
});
