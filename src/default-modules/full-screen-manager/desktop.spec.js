import { expect } from 'chai';
import sinon from 'sinon';

import DesktopFullScreen from './desktop';

describe('DesktopFullScreen', () => {
  const callback = sinon.spy();
  let element;
  let fullScreen;
  const fullScreenFn = {
    'requestFullscreen': 'requestFullscreen',
    'exitFullscreen': 'exitFullscreen',
    'fullscreenElement': 'fullscreenElement',
    'fullscreenEnabled': 'fullscreenEnabled',
    'fullscreenchange': 'fullscreenchange',
    'fullscreenerror': 'fullscreenerror'
  };

  beforeEach(() => {
    element = document.createElement('div');
    fullScreen = new DesktopFullScreen(element, callback);
    fullScreen._fullscreenFn = fullScreenFn;
  });

  afterEach(() => {
    callback.reset();
  });

  describe('enable status', () => {
    it('should be based on native support', () => {
      document[fullScreenFn.fullscreenEnabled] = false;
      expect(fullScreen.isEnabled).to.be.false;

      document[fullScreenFn.fullscreenEnabled] = true;
      expect(fullScreen.isEnabled).to.be.true;
    });
  });

  describe('full screen status', () => {
    it('should be based on native status', () => {
      document[fullScreenFn.fullscreenElement] = false;
      expect(fullScreen.isInFullScreen).to.be.false;

      document[fullScreenFn.fullscreenElement] = true;
      expect(fullScreen.isInFullScreen).to.be.true;
    });
  });

  describe('method for entering full screen', () => {
    it('should use native method', () => {
      document[fullScreenFn.fullscreenEnabled] = true;
      element[fullScreenFn.requestFullscreen] = sinon.spy();

      Reflect.defineProperty(navigator, 'userAgent', {
        ...Reflect.getOwnPropertyDescriptor(navigator.constructor.prototype, 'userAgent'),
        get: function() { return this.____navigator },
        set: function(v) { this.____navigator = v; }
      });
      navigator.userAgent = '5.1 Safari';
      fullScreen.request();
      expect(element[fullScreenFn.requestFullscreen].calledWithExactly()).to.be.true;
      Reflect.deleteProperty(navigator, 'userAgent');
      element[fullScreenFn.requestFullscreen].reset();

      fullScreen.request();
      expect(element[fullScreenFn.requestFullscreen].calledWithExactly(false)).to.be.true;
      element[fullScreenFn.requestFullscreen].reset();

      Element['ALLOW_KEYBOARD_INPUT'] = false;
      fullScreen.request();
      expect(element[fullScreenFn.requestFullscreen].calledWithExactly(false)).to.be.true;
      element[fullScreenFn.requestFullscreen].reset();

      Element['ALLOW_KEYBOARD_INPUT'] = true;
      fullScreen.request();
      expect(element[fullScreenFn.requestFullscreen].calledWithExactly(true)).to.be.true;
      element[fullScreenFn.requestFullscreen].reset();

    });

    it('should do nothing if not enabled', () => {
      document[fullScreenFn.fullscreenEnabled] = false;
      element[fullScreenFn.requestFullscreen] = sinon.spy();
      fullScreen.request();
      expect(element[fullScreenFn.requestFullscreen].called).to.be.false;
    });
  });

  describe('method for exit full screen', () => {
    it('should use native method', () => {
      document[fullScreenFn.fullscreenEnabled] = true;
      document[fullScreenFn.exitFullscreen] = sinon.spy();
      fullScreen.exit();
      expect(document[fullScreenFn.exitFullscreen].called).to.be.true;
    });

    it('should do nothing if not enabled', () => {
      document[fullScreenFn.fullscreenEnabled] = false;
      document[fullScreenFn.exitFullscreen] = sinon.spy();
      fullScreen.exit();
      expect(document[fullScreenFn.exitFullscreen].called).to.be.false;
    });
  });

  describe('due to reaction on native full screen change', () => {
    it('should call callback', () => {
      const changeEvent = new Event(fullScreenFn.fullscreenchange);

      document.dispatchEvent(changeEvent);
      expect(callback.called).to.be.true;
    });
  });

  describe('destroy method', () => {
    it('should clear on event listeners', () => {
      const changeEvent = new Event(fullScreenFn.fullscreenchange);

      document[fullScreenFn.fullscreenEnabled] = true;
      fullScreen.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback.called).to.be.false;
    });
  });
});
