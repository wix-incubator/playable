import 'jsdom-global/register';
import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../../testkit';

import VolumeControl from './volume';

import { VIDEO_EVENTS } from '../../../../constants';

describe('VolumeControl', () => {
  let testkit;
  let control: any;
  let eventEmitter: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();

    testkit.registerModule('volumeControl', VolumeControl);
    control = testkit.getModule('volumeControl');
    eventEmitter = testkit.getModule('eventEmitter');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exist;
      expect(control.view).to.exist;
    });
  });

  describe('API', () => {
    it('should have method for setting current volume', () => {
      const spy = sinon.spy(control.view, 'setVolume');
      expect(control.setVolumeLevel).to.exist;
      control.setVolumeLevel(0);
      expect(spy.called).to.be.true;
    });

    it('should have method for setting mute status', () => {
      const spy = sinon.spy(control.view, 'setMute');
      expect(control.setMuteStatus).to.exist;
      control.setMuteStatus();
      expect(spy.called).to.be.true;
    });

    it('should have method for showing whole view', () => {
      expect(control.show).to.exist;
      control.show();
      expect(control.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(control.hide).to.exist;
      control.hide();
      expect(control.isHidden).to.be.true;
    });

    it('should have method for destroying', () => {
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).to.exist;
      control.destroy();
      expect(control.view).to.not.exist;
      expect(control._eventEmitter).to.not.exist;
      expect(spy.called).to.be.true;
    });
  });

  describe('video events listeners', () => {
    it('should call callback on playback status change', () => {
      const spy = sinon.spy(control, '_updateVolumeStatus');
      control._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.VOLUME_STATUS_CHANGED);
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should change volume level based on wheel delta', () => {
      const startSpy = sinon.spy(control, '_changeVolumeStatus');
      control._getVolumeLevelFromWheel(-100);
      expect(startSpy.calledWith(90)).to.be.true;
    });

    it('should change volume level based on input', () => {
      const startSpy = sinon.spy(control, '_changeVolumeStatus');
      control._getVolumeLevelFromInput(40);
      expect(startSpy.calledWith(40)).to.be.true;
    });

    it('should change volume level and mute status of video', () => {
      const volumeSpy = sinon.spy(control, '_changeVolumeLevel');
      const muteSpy = sinon.spy(control, '_toggleMuteStatus');
      control._changeVolumeStatus(90);
      expect(volumeSpy.calledWith(90)).to.be.true;
      expect(muteSpy.called).to.be.false;
      control._engine.mute();
      control._changeVolumeStatus(90);
      expect(muteSpy.called).to.be.true;
    });
  });
});
