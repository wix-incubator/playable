import 'jsdom-global/register';
import { expect } from 'chai';

import { isIPhone, isIPod, isIPad, isAndroid } from './device-detection';

declare const navigator: any;

describe('Utils device detection method', () => {
  beforeEach(() => {
    Reflect.defineProperty(navigator, 'userAgent', {
      ...Reflect.getOwnPropertyDescriptor(
        navigator.constructor.prototype,
        'userAgent',
      ),
      get() {
        return this.____navigator;
      },
      set(v) {
        this.____navigator = v;
      },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'userAgent');
  });

  describe('isIPhone', () => {
    it('should return true on iPhone device', () => {
      navigator.userAgent = 'iPhone';

      expect(isIPhone()).to.be.true;
    });

    it('should return false if not on iPhone', () => {
      navigator.userAgent = 'Computer';

      expect(isIPhone()).to.be.false;
    });
  });

  describe('isIPod', () => {
    it('should return true on isIPod device', () => {
      navigator.userAgent = 'iPod';

      expect(isIPod()).to.be.true;
    });

    it('should return false if not on isIPod', () => {
      navigator.userAgent = 'Computer';

      expect(isIPod()).to.be.false;
    });
  });

  describe('isIPad', () => {
    it('should return true on iPhone device', () => {
      navigator.userAgent = 'iPad';

      expect(isIPad()).to.be.true;
    });

    it('should return false if not on iPad', () => {
      navigator.userAgent = 'Computer';

      expect(isIPad()).to.be.false;
    });
  });

  describe('isAndroid', () => {
    it('should return true on Android device', () => {
      navigator.userAgent = 'Android';

      expect(isAndroid()).to.be.true;
    });

    it('should return false if not on Android', () => {
      navigator.userAgent = 'Computer';

      expect(isAndroid()).to.be.false;
    });
  });
});
