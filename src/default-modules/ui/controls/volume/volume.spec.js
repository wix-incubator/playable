import 'jsdom-global/register';

import EventEmitter from 'eventemitter3';

import { expect } from 'chai';
import sinon from 'sinon';

import VolumeControl from './volume.controler';
import Engine from '../../../playback-engine/playback-engine';
import TextMap from '../../../text-map/text-map';

import { VIDEO_EVENTS } from '../../../../constants/index';


describe('VolumeControl', () => {
  let control;
  let engine;
  let eventEmitter;
  let config = {};
  let textMap;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config
    });

    textMap = new TextMap({
      config
    });

    control = new VolumeControl({
      engine,
      eventEmitter,
      textMap,
      config
    });
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });
  });

  describe('API', () => {
    it('should have method for setting current volume', () => {
      const spy = sinon.spy(control.view, 'setState');
      expect(control.setVolumeLevel).to.exist;
      control.setVolumeLevel(100);
      expect(spy.called).to.be.false;
      control.setVolumeLevel(0);
      expect(spy.called).to.be.true;
    });

    it('should have method for setting duration time', () => {
      const spy = sinon.spy(control.view, 'setState');
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
      control._isMuted = true;
      control._changeVolumeStatus(90);
      expect(muteSpy.called).to.be.true;
    });
  });

  describe('View', () => {
    it('should react on volume range input change event when not muted', () => {
      const callback = sinon.spy(control.view, "_onInputChange");
      control.view._bindEvents();

      control.view.$input.trigger('change');
      expect(callback.called).to.be.true;
    });

    it('should react on volume range input input event', () => {
      const callback = sinon.spy(control.view, "_onInputChange");
      control.view._bindEvents();

      control.view.$input.trigger('input');
      expect(callback.called).to.be.true;
    });

    it('should react on volume range wheel input event', () => {
      const callback = sinon.spy(control.view, "_onWheel");
      control.view._bindEvents();

      control.view.$node.trigger('wheel');
      expect(callback.called).to.be.true;
    });

    it('should react on mute button click', () => {
      const callback = sinon.spy(control, "_toggleMuteStatus");
      control._bindCallbacks();
      control._initUI();

      control.view.$muteControl.trigger('click');
      expect(callback.called).to.be.true;
    });

    it('should call callbacks', () => {
      const inputSpy = sinon.spy(control, '_getVolumeLevelFromInput');
      const wheelSpy = sinon.spy(control, '_getVolumeLevelFromWheel');

      control._bindCallbacks();
      control._initUI();

      control.view._onInputChange();
      expect(inputSpy.called).to.be.true;
      control.view._onWheel({
        preventDefault: () => {},
        deltaY: 10
      });
      expect(wheelSpy.called).to.be.true;
    });

    it('should have method for setting current state', () => {
      expect(control.view.setState).to.exist;
    });

    it('should have method for showing itself', () => {
      expect(control.view.show).to.exist;
    });

    it('should have method for hidding itself', () => {
      expect(control.view.hide).to.exist;
    });

    it('should have method gettind root node', () => {
      expect(control.view.getNode).to.exist;
    });

    it('should have method for destroying', () => {
      expect(control.view.destroy).to.exist;
    });
  });
});
