import 'jsdom-global/register';

import { expect } from 'chai';

import TimeControl from './time.controler';


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
});
