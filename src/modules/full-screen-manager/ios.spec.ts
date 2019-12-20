import IOSFullScreen from './ios';

describe('IOSFullScreen', () => {
  const callback = jest.fn();
  let element: any;
  let fullScreen: any;

  beforeEach(() => {
    element = document.createDocumentFragment();
    fullScreen = new IOSFullScreen(element, callback);
  });

  afterEach(() => {
    callback.mockReset();
  });

  describe('enable state', () => {
    test('should return true in native state is true', () => {
      element.webkitSupportsFullscreen = true;
      expect(fullScreen.isEnabled).toBe(true);
    });

    test('should return false in native state is false', () => {
      element.webkitSupportsFullscreen = false;
      expect(fullScreen.isEnabled).toBe(false);
    });
  });

  describe('full screen state', () => {
    test('should return true in native state is true', () => {
      element.webkitDisplayingFullscreen = true;
      expect(fullScreen.isInFullScreen).toBe(true);
    });

    test('should return false in native state is false', () => {
      element.webkitDisplayingFullscreen = false;
      expect(fullScreen.isInFullScreen).toBe(false);
    });
  });

  describe('method for entering full screen', () => {
    test('should use native method', () => {
      element.webkitSupportsFullscreen = true;
      element.webkitEnterFullscreen = jest.fn();
      fullScreen.request();
      expect(element.webkitEnterFullscreen).toHaveBeenCalled();
    });

    test('should make postpone enter if do not have metadata', () => {
      element.webkitSupportsFullscreen = true;
      element.readyState = 0;

      const metadataEvent = new Event('loadedmetadata');
      element.webkitEnterFullscreen = () => {
        throw new Error('Catch');
      };

      fullScreen.request();
      fullScreen.request();
      element.webkitEnterFullscreen = jest.fn();
      element.dispatchEvent(metadataEvent);
      expect(element.webkitEnterFullscreen).toHaveBeenCalledTimes(1);
    });

    test('should do nothing if not enabled', () => {
      element.webkitSupportsFullscreen = false;
      element.webkitEnterFullscreen = jest.fn();
      fullScreen.request();
      expect(element.webkitEnterFullscreen).not.toHaveBeenCalled();
    });

    test('should do nothing if already in full screen', () => {
      element.webkitDisplayingFullscreen = true;
      element.webkitEnterFullscreen = jest.fn();
      fullScreen.request();
      expect(element.webkitEnterFullscreen).not.toHaveBeenCalled();
    });
  });

  describe('method for exit full screen', () => {
    test('should use native method', () => {
      element.webkitSupportsFullscreen = true;
      element.webkitDisplayingFullscreen = true;
      element.webkitExitFullscreen = jest.fn();
      fullScreen.exit();
      expect(element.webkitExitFullscreen).toHaveBeenCalled();
    });

    test('should do nothing if not enabled', () => {
      element.webkitSupportsFullscreen = false;
      element.webkitExitFullscreen = jest.fn();
      fullScreen.exit();
      expect(element.webkitExitFullscreen).not.toHaveBeenCalled();
    });

    test('should do nothing if not in full screen', () => {
      element.webkitDisplayingFullscreen = false;
      element.webkitExitFullscreen = jest.fn();
      fullScreen.exit();
      expect(element.webkitExitFullscreen).not.toHaveBeenCalled();
    });
  });

  describe('due to reaction on native full screen change', () => {
    test('should call callback if enter', () => {
      const enterEvent = new Event('webkitbeginfullscreen');

      element.dispatchEvent(enterEvent);
      expect(callback).toHaveBeenCalled();
    });

    test('should call callback if exit', () => {
      const exitEvent = new Event('webkitendfullscreen');

      element.dispatchEvent(exitEvent);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('destroy method', () => {
    test('should clear loadedmetadata listener', () => {
      const metadataEvent = new Event('loadedmetadata');

      element.webkitSupportsFullscreen = true;
      element.readyState = 0;
      element.webkitEnterFullscreen = () => {
        throw new Error('Catch');
      };

      fullScreen.request();
      element.webkitEnterFullscreen = jest.fn();
      fullScreen.destroy();

      element.dispatchEvent(metadataEvent);
      expect(element.webkitEnterFullscreen).not.toHaveBeenCalled();
    });

    test('should clear webkitbeginfullscreen listener', () => {
      const enterEvent = new Event('webkitbeginfullscreen');
      element.webkitSupportsFullscreen = true;

      fullScreen.destroy();

      element.dispatchEvent(enterEvent);
      expect(callback).not.toHaveBeenCalled();
    });

    test('should clear webkitendfullscreen listener', () => {
      const exitEvent = new Event('webkitendfullscreen');
      element.webkitSupportsFullscreen = true;

      fullScreen.destroy();

      element.dispatchEvent(exitEvent);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
