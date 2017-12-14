import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import LiveIndicator from './live-indicator';

import { describe } from 'selenium-webdriver/testing';
import { STATES, VIDEO_EVENTS } from '../../../constants';

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

  describe('on playback status change', () => {
    it('should hide and deactivate on `SRC_SET`', () => {
      const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');
      const viewToggleActiveSpy = sinon.spy(liveIndicator.view, 'toggleActive');

      liveIndicator.show();

      expect(liveIndicator.isHidden, 'hidden before SRC_SET').to.be.false;

      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: STATES.SRC_SET,
      });

      expect(liveIndicator.isHidden).to.be.true;
      expect(viewToggleSpy.calledWith(false)).to.be.true;
      expect(viewToggleActiveSpy.calledWith(false)).to.be.true;

      viewToggleSpy.restore();
      viewToggleActiveSpy.restore();
    });

    it('should ignore on `METADATA_LOADED` for NOT dynamic content', () => {
      const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');

      expect(engine.isDynamicContent, 'dynamic content').to.be.false;
      expect(liveIndicator.isHidden, 'hidden before METADATA_LOADED').to.be
        .true;

      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
        nextState: STATES.METADATA_LOADED,
      });

      expect(liveIndicator.isHidden).to.be.true;
      expect(viewToggleSpy.called).to.be.false;

      viewToggleSpy.restore();
    });

    describe('for dynamic content', () => {
      beforeEach(() => {
        Reflect.defineProperty(engine, 'isDynamicContent', {
          ...Reflect.getOwnPropertyDescriptor(
            engine.constructor.prototype,
            'isDynamicContent',
          ),
          get: () => true,
        });
      });

      afterEach(() => {
        Reflect.deleteProperty(engine, 'isDynamicContent');
      });

      it('should show when `METADATA_LOADED`', () => {
        const viewToggleSpy = sinon.spy(liveIndicator.view, 'toggle');

        expect(engine.isDynamicContent, 'dynamic content').to.be.true;
        expect(liveIndicator.isHidden, 'hidden before METADATA_LOADED').to.be
          .true;

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.METADATA_LOADED,
        });

        expect(liveIndicator.isHidden).to.be.false;
        expect(viewToggleSpy.calledWith(true)).to.be.true;

        viewToggleSpy.restore();
      });

      it('should activate when `PLAYING` sync with live', () => {
        const viewToggleActiveSpy = sinon.spy(
          liveIndicator.view,
          'toggleActive',
        );

        Reflect.defineProperty(engine, 'isSyncWithLive', {
          ...Reflect.getOwnPropertyDescriptor(
            engine.constructor.prototype,
            'isSyncWithLive',
          ),
          get: () => true,
        });

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.METADATA_LOADED,
        });

        expect(liveIndicator.isHidden, 'hidden before `PLAYING`').to.be.false;
        expect(liveIndicator.isActive, 'active before `PLAYING`').to.be.false;

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAYING,
        });

        expect(liveIndicator.isActive).to.be.true;
        expect(viewToggleActiveSpy.calledWith(true)).to.be.true;

        viewToggleActiveSpy.restore();
        Reflect.deleteProperty(engine, 'isSyncWithLive');
      });

      it('should deactivate when `PLAYING` out of sync with live', () => {
        const viewToggleActiveSpy = sinon.spy(
          liveIndicator.view,
          'toggleActive',
        );

        Reflect.defineProperty(engine, 'isSyncWithLive', {
          ...Reflect.getOwnPropertyDescriptor(
            engine.constructor.prototype,
            'isSyncWithLive',
          ),
          get: () => true,
        });

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.METADATA_LOADED,
        });

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAYING,
        });

        expect(liveIndicator.isActive, 'active before out of sync').to.be.true;

        Reflect.defineProperty(engine, 'isSyncWithLive', {
          ...Reflect.getOwnPropertyDescriptor(
            engine.constructor.prototype,
            'isSyncWithLive',
          ),
          get: () => false,
        });

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAYING,
        });

        expect(liveIndicator.isActive).to.be.false;
        expect(viewToggleActiveSpy.lastCall.calledWith(false)).to.be.true;

        viewToggleActiveSpy.restore();
        Reflect.deleteProperty(engine, 'isSyncWithLive');
      });

      it('should deactivate when NOT `PLAYING`', () => {
        const viewToggleActiveSpy = sinon.spy(
          liveIndicator.view,
          'toggleActive',
        );

        Reflect.defineProperty(engine, 'isSyncWithLive', {
          ...Reflect.getOwnPropertyDescriptor(
            engine.constructor.prototype,
            'isSyncWithLive',
          ),
          get: () => true,
        });

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.METADATA_LOADED,
        });

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PLAYING,
        });

        expect(liveIndicator.isActive, 'active before `PAUSED`').to.be.true;

        eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {
          nextState: STATES.PAUSED,
        });

        expect(liveIndicator.isActive).to.be.false;
        expect(viewToggleActiveSpy.lastCall.calledWith(false)).to.be.true;

        viewToggleActiveSpy.restore();
        Reflect.deleteProperty(engine, 'isSyncWithLive');
      });
    });
  });
});
