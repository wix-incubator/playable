import 'jsdom-global/register';
import { expect } from 'chai';

import { isIPhone, isIPod, isIPad, isAndroid } from './device-detection';


describe('Utils device detection method', () => {
  beforeEach(() => {
    Reflect.defineProperty(navigator, 'userAgent', {
      ...Reflect.getOwnPropertyDescriptor(navigator.constructor.prototype, 'userAgent'),
      get: function() { return this.____navigator },
      set: function(v) { this.____navigator = v; }
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'userAgent');
  });

  describe('isIPhone', () => {
    it('should return true on iPhone device', () => {
      navigator.userAgent = 'Computer';

      expect(isIPhone()).to.be.false;

      navigator.userAgent = 'iPhone';

      expect(isIPhone()).to.be.true;
    });
  });

  describe('isIPod', () => {
    it('should return true on iPhone device', () => {
      navigator.userAgent = 'Computer';

      expect(isIPod()).to.be.false;

      navigator.userAgent = 'iPod';

      expect(isIPod()).to.be.true;
    });
  });

  describe('isIPad', () => {
    it('should return true on iPhone device', () => {
      navigator.userAgent = 'Computer';

      expect(isIPad()).to.be.false;

      navigator.userAgent = 'iPad';

      expect(isIPad()).to.be.true;
    });
  });

  describe('isAndroid', () => {
    it('should return true on iPhone device', () => {
      navigator.userAgent = 'Computer';

      expect(isAndroid()).to.be.false;

      navigator.userAgent = 'Android';

      expect(isAndroid()).to.be.true;
    });
  });
});
