import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import DesktopFullScreen from './desktop';

import { setProperty, resetProperty } from '../../testkit';

declare const navigator: any;

describe('DesktopFullScreen', () => {
  const callback = sinon.spy();
  let element;
  let fullScreen;
  const fullScreenFn = {
    requestFullscreen: 'requestFullscreen',
    exitFullscreen: 'exitFullscreen',
    fullscreenElement: 'fullscreenElement',
    fullscreenEnabled: 'fullscreenEnabled',
    fullscreenchange: 'fullscreenchange',
    fullscreenerror: 'fullscreenerror',
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
    it('should return true in native status is true', () => {
      document[fullScreenFn.fullscreenEnabled] = true;
      expect(fullScreen.isEnabled).to.be.true;
    });

    it('should return false in native status is false', () => {
      document[fullScreenFn.fullscreenEnabled] = false;
      expect(fullScreen.isEnabled).to.be.false;
    });
  });

  describe('full screen status', () => {
    it('should return true in native status is true', () => {
      document[fullScreenFn.fullscreenElement] = true;
      expect(fullScreen.isInFullScreen).to.be.true;
    });

    it('should return false in native status is false', () => {
      document[fullScreenFn.fullscreenElement] = false;
      expect(fullScreen.isInFullScreen).to.be.false;
    });
  });

  describe('method for entering full screen', () => {
    describe('with usage of native method', () => {
      describe('if it enabled', () => {
        beforeEach(() => {
          document[fullScreenFn.fullscreenEnabled] = true;
        });
        describe('on Safari 5.1', () => {
          beforeEach(() => {
            element[fullScreenFn.requestFullscreen] = sinon.spy();

            setProperty(navigator, 'userAgent', '5.1 Safari');
          });

          afterEach(() => {
            resetProperty(navigator, 'userAgent');
          });

          it('should call it without arguments', () => {
            fullScreen.request();
            expect(element[fullScreenFn.requestFullscreen].calledWithExactly())
              .to.be.true;
          });
        });
        describe('on not Safari 5.1', () => {
          beforeEach(() => {
            element[fullScreenFn.requestFullscreen] = sinon.spy();
          });

          it('should call it with true if ALLOW_KEYBOARD_INPUT is true', () => {
            (Element as any).ALLOW_KEYBOARD_INPUT = true;
            fullScreen.request();
            expect(
              element[fullScreenFn.requestFullscreen].calledWithExactly(true),
            ).to.be.true;
          });

          it('should call it with false if ALLOW_KEYBOARD_INPUT is false', () => {
            (Element as any).ALLOW_KEYBOARD_INPUT = false;
            fullScreen.request();
            expect(
              element[fullScreenFn.requestFullscreen].calledWithExactly(false),
            ).to.be.true;
          });
        });
      });
      describe('if it disabled', () => {
        beforeEach(() => {
          document[fullScreenFn.fullscreenEnabled] = false;
          element[fullScreenFn.requestFullscreen] = sinon.spy();
        });
        it('should not call it', () => {
          fullScreen.request();
          expect(element[fullScreenFn.requestFullscreen].called).to.be.false;
        });
      });
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
