import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import { VIDEO_EVENTS, STATES } from '../../../constants/index';

describe('ControlsBlock', () => {
  let testkit;
  let controls;
  let eventEmitter;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    eventEmitter = testkit.getModule('eventEmitter');
    controls = testkit.getModule('controls');
  });
  describe('constructor', () => {
    it('should create instance ', () => {
      expect(controls).to.exist;
      expect(controls.view).to.exist;
    });
  });

  describe('instance', () => {
    it('should have method for setting controls focused state', () => {
      expect(controls._setFocusState).to.exist;
      controls._setFocusState();
      expect(controls._isControlsFocused).to.be.true;
    });

    it('should have method for removing controls focused state', () => {
      expect(controls._removeFocusState).to.exist;
      controls._setFocusState();
      controls._removeFocusState({
        stopPropagation: () => {},
      });
      expect(controls._isControlsFocused).to.be.false;
    });

    it('should have method for setting playback status', () => {
      expect(controls._updatePlayingStatus).to.exist;

      const startTimeout = sinon.spy(controls, '_startHideControlsTimeout');
      const hideTimeout = sinon.spy(controls, '_hideContent');
      const showTimeout = sinon.spy(controls, '_showContent');

      controls._updatePlayingStatus({ nextState: STATES.PLAY_REQUESTED });
      expect(startTimeout.called).to.be.true;
      controls._updatePlayingStatus({ nextState: STATES.PAUSED });
      expect(showTimeout.called).to.be.true;
      showTimeout.reset();
      controls._updatePlayingStatus({ nextState: STATES.ENDED });
      expect(showTimeout.called).to.be.true;
      showTimeout.reset();
      controls._updatePlayingStatus({ nextState: STATES.SRC_SET });
      expect(showTimeout.called).to.be.true;
    });

    it('should have method for hiding controls on timeout', () => {
      const timeoutSpy = sinon.spy(global, 'setTimeout');
      const clearSpy = sinon.spy(global, 'clearTimeout');
      controls._startHideControlsTimeout();
      expect(timeoutSpy.calledWith(controls._tryHideContent)).to.be.true;
      controls._startHideControlsTimeout();
      expect(clearSpy.called).to.be.true;

      timeoutSpy.restore();
      clearSpy.restore();
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback status change', () => {
      const spy = sinon.spy(controls, '_updatePlayingStatus');
      controls._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED, {});
      expect(spy.called).to.be.true;
    });
  });

  describe('API', () => {
    it('should have method for showing whole view', () => {
      expect(controls.show).to.exist;
      controls.show();
      expect(controls.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(controls.hide).to.exist;
      controls.hide();
      expect(controls.isHidden).to.be.true;
    });

    it('should have method for destroying', () => {
      const spy = sinon.spy(controls, '_unbindEvents');
      expect(controls.destroy).to.exist;
      controls.destroy();
      expect(controls.view).to.not.exist;
      expect(controls.fullscreenControl).to.not.exist;
      expect(controls.playControl).to.not.exist;
      expect(controls.progressControl).to.not.exist;
      expect(controls.timeControl).to.not.exist;
      expect(controls.volumeControl).to.not.exist;
      expect(spy.called).to.be.true;
    });
  });

  describe('View', () => {
    it('should have method for adding node with control', () => {
      expect(controls.view.appendControlNodeLeft).to.exist;
    });

    it('should have method for adding node with control', () => {
      expect(controls.view.appendControlNodeRight).to.exist;
    });

    it('should have method for showing block with controls', () => {
      expect(controls.view.showControlsBlock).to.exist;
    });

    it('should have method for hidding block with controls', () => {
      expect(controls.view.hideControlsBlock).to.exist;
    });

    it('should have method for showing itself', () => {
      expect(controls.view.show).to.exist;
    });

    it('should have method for hidding itself', () => {
      expect(controls.view.hide).to.exist;
    });

    it('should have method gettind root node', () => {
      expect(controls.view.getNode).to.exist;
    });

    it('should have method for destroying', () => {
      expect(controls.view.destroy).to.exist;
    });
  });
});
