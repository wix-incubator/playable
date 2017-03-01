import 'jsdom-global/register';

import { expect } from 'chai';

import TimeControl from './time.controler';
import { formatTime } from './time.view';

describe('TimeControl', () => {
  let control = {};

  describe('constructor', () => {
    beforeEach(() => {
      control = new TimeControl({});
    });

    it('should create instance ', () => {
      expect(control).to.exists;
      expect(control.view).to.exists;
    });
  });

  describe('formatTime', () => {
    it('should return valid string', () => {
      expect(formatTime(NaN)).to.be.equal('00:00');
      expect(formatTime(Infinity)).to.be.equal('00:00');
      expect(formatTime(0)).to.be.equal('00:00');
      expect(formatTime(-10)).to.be.equal('23:59:50');
      expect(formatTime(10)).to.be.equal('00:10');
      expect(formatTime(110)).to.be.equal('01:50');
      expect(formatTime(11100)).to.be.equal('03:05:00');
    });
  });


  describe('API', () => {
    beforeEach(() => {
      control = new TimeControl({});
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
  });
});
