import 'jsdom-global/register';
import { expect } from 'chai';

import { isIPhone, isIPod, isIPad, isAndroid } from './device-detection';

import { setProperty, resetProperty } from '../testkit';

declare const navigator: any;

describe('Utils device detection method', () => {
  afterEach(() => {
    resetProperty(navigator, 'userAgent');
  });

  describe('isIPhone', () => {
    it('should return true on iPhone device', () => {
      setProperty(navigator, 'userAgent', 'iPhone');

      expect(isIPhone()).to.be.true;
    });

    it('should return false if not on iPhone', () => {
      setProperty(navigator, 'userAgent', 'Computer');

      expect(isIPhone()).to.be.false;
    });
  });

  describe('isIPod', () => {
    it('should return true on isIPod device', () => {
      setProperty(navigator, 'userAgent', 'iPod');

      expect(isIPod()).to.be.true;
    });

    it('should return false if not on isIPod', () => {
      setProperty(navigator, 'userAgent', 'Computer');

      expect(isIPod()).to.be.false;
    });
  });

  describe('isIPad', () => {
    it('should return true on iPad device', () => {
      setProperty(navigator, 'userAgent', 'iPad');

      expect(isIPad()).to.be.true;
    });

    it('should return false if not on iPad', () => {
      setProperty(navigator, 'userAgent', 'Computer');

      expect(isIPad()).to.be.false;
    });
  });

  describe('isAndroid', () => {
    it('should return true on Android device', () => {
      setProperty(navigator, 'userAgent', 'Android');

      expect(isAndroid()).to.be.true;
    });

    it('should return false if not on Android', () => {
      setProperty(navigator, 'userAgent', 'Computer');

      expect(isAndroid()).to.be.false;
    });
  });
});
