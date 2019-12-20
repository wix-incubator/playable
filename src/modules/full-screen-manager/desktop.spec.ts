import DesktopFullScreen from './desktop';

import { setProperty, resetProperty } from '../../testkit';

declare const navigator: any;

describe('DesktopFullScreen', () => {
  const callback = jest.fn();
  let element: any;
  let fullScreen: any;
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
    callback.mockReset();
  });

  describe('enable state', () => {
    test('should return true in native state is true', () => {
      (document as any)[fullScreenFn.fullscreenEnabled] = true;
      expect(fullScreen.isEnabled).toBe(true);
    });

    test('should return false in native state is false', () => {
      (document as any)[fullScreenFn.fullscreenEnabled] = false;
      expect(fullScreen.isEnabled).toBe(false);
    });
  });

  describe('full screen state', () => {
    test('should return true in native state is true', () => {
      (document as any)[fullScreenFn.fullscreenElement] = true;
      expect(fullScreen.isInFullScreen).toBe(true);
    });

    test('should return false in native state is false', () => {
      (document as any)[fullScreenFn.fullscreenElement] = false;
      expect(fullScreen.isInFullScreen).toBe(false);
    });
  });

  describe('method for entering full screen', () => {
    describe('with usage of native method', () => {
      describe('if it enabled', () => {
        beforeEach(() => {
          (document as any)[fullScreenFn.fullscreenEnabled] = true;
        });
        describe('on Safari 5.1', () => {
          beforeEach(() => {
            element[fullScreenFn.requestFullscreen] = jest.fn();

            setProperty(navigator, 'userAgent', '5.1 Safari');
          });

          afterEach(() => {
            resetProperty(navigator, 'userAgent');
          });

          test('should call it without arguments', () => {
            fullScreen.request();
            expect(
              element[fullScreenFn.requestFullscreen],
            ).toHaveBeenCalledWith();
          });
        });
        describe('on not Safari 5.1', () => {
          beforeEach(() => {
            element[fullScreenFn.requestFullscreen] = jest.fn();
          });

          test('should call it with true if ALLOW_KEYBOARD_INPUT is true', () => {
            (Element as any).ALLOW_KEYBOARD_INPUT = true;
            fullScreen.request();
            expect(
              element[fullScreenFn.requestFullscreen],
            ).toHaveBeenCalledWith(true);
          });

          test('should call it with false if ALLOW_KEYBOARD_INPUT is false', () => {
            (Element as any).ALLOW_KEYBOARD_INPUT = false;
            fullScreen.request();
            expect(
              element[fullScreenFn.requestFullscreen],
            ).toHaveBeenCalledWith(false);
          });
        });
      });
      describe('if it disabled', () => {
        beforeEach(() => {
          (document as any)[fullScreenFn.fullscreenEnabled] = false;
          element[fullScreenFn.requestFullscreen] = jest.fn();
        });
        test('should not call it', () => {
          fullScreen.request();
          expect(
            element[fullScreenFn.requestFullscreen],
          ).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('method for exit full screen', () => {
    test('should use native method', () => {
      (document as any)[fullScreenFn.fullscreenEnabled] = true;
      (document as any)[fullScreenFn.exitFullscreen] = jest.fn();
      fullScreen.exit();
      expect((document as any)[fullScreenFn.exitFullscreen]).toHaveBeenCalled();
    });

    test('should do nothing if not enabled', () => {
      (document as any)[fullScreenFn.fullscreenEnabled] = false;
      (document as any)[fullScreenFn.exitFullscreen] = jest.fn();
      fullScreen.exit();
      expect(
        (document as any)[fullScreenFn.exitFullscreen],
      ).not.toHaveBeenCalled();
    });
  });

  describe('due to reaction on native full screen change', () => {
    test('should call callback', () => {
      const changeEvent = new Event(fullScreenFn.fullscreenchange);

      document.dispatchEvent(changeEvent);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('destroy method', () => {
    test('should clear on event listeners', () => {
      const changeEvent = new Event(fullScreenFn.fullscreenchange);

      (document as any)[fullScreenFn.fullscreenEnabled] = true;
      fullScreen.destroy();

      element.dispatchEvent(changeEvent);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
