import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import FullScreenControl from './full-screen.controler';


describe('FullScreenControl', () => {
  let control = {};
  let onEnterFullScreenClick = null;
  let onExitFullScreenClick = null;

  describe('constructor', () => {
    beforeEach(() => {
      control = new FullScreenControl({});
    });

    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      onEnterFullScreenClick = sinon.spy();
      onExitFullScreenClick = sinon.spy();

      control = new FullScreenControl({
        onEnterFullScreenClick,
        onExitFullScreenClick
      });
    });

    it('should react on volume range input change', () => {
      control.view.$enterIcon.trigger('click');
      expect(onEnterFullScreenClick.called).to.be.true;
    });

    it('should react on mute status input click', () => {
      control.view.$exitIcon.trigger('click');
      expect(onExitFullScreenClick.called).to.be.true;
    });
  });
});
