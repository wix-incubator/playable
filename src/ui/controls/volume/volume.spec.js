import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import VolumeControl from './volume.controler';


describe('VolumeControl', () => {
  let control = {};
  let onVolumeLevelChange = null;
  let onMuteStatusChange = null;

  describe('constructor', () => {
    beforeEach(() => {
      control = new VolumeControl({});
    });

    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      onVolumeLevelChange = sinon.spy();
      onMuteStatusChange = sinon.spy();

      control = new VolumeControl({
        onVolumeLevelChange,
        onMuteStatusChange
      });
    });

    it('should react on volume range input change event', () => {
      const callback = sinon.spy(control, "_changeVolumeLevel");
      control._initEvents();

      control.view.$input.trigger('change');
      expect(callback.called).to.be.true;
      expect(onVolumeLevelChange.called).to.be.true;
    });

    it('should react on volume range input input event', () => {
      const callback = sinon.spy(control, "_changeVolumeLevel");
      control._initEvents();

      control.view.$input.trigger('input');
      expect(callback.called).to.be.true;
      expect(onVolumeLevelChange.called).to.be.true;
    });

    it('should react on mute status input click event', () => {
      const callback = sinon.spy(control, "_changeMuteStatus");
      control._initEvents();

      control.view.$volumeIcon.trigger('click');
      expect(callback.called).to.be.true;
      expect(onMuteStatusChange.called).to.be.true;
    });

    it('should react on unmute status input click event', () => {
      const callback = sinon.spy(control, "_changeMuteStatus");
      control._initEvents();

      control.view.$volumeMutedIcon.trigger('click');
      expect(callback.called).to.be.true;
      expect(onMuteStatusChange.called).to.be.true;
    });

    it('should set mute state if volume is 0', () => {
      control.setVolumeLevel(0);
      expect(control.volumeLevel).to.be.equal(0);
      expect(onMuteStatusChange.called).to.be.true;
    });
  });
});
