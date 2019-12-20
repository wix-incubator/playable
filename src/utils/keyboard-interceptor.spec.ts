import logger from './logger';
import KeyboardInterceptor from './keyboard-interceptor';

describe('KeyboardInterceptor', () => {
  let element: HTMLElement;
  let interceptor: KeyboardInterceptor;
  const keydownEvent: any = new Event('keydown');

  beforeEach(() => {
    element = document.createElement('div');
  });

  describe('', () => {
    afterEach(() => {
      interceptor.destroy();
    });

    test('should intercept and broadcast keydown events', () => {
      const testKeyCode1 = 10;
      const testKeyCode2 = 20;
      const callbacks = {
        [testKeyCode1]: jest.fn(),
        [testKeyCode2]: jest.fn(),
      };

      interceptor = new KeyboardInterceptor(element, callbacks);

      keydownEvent.keyCode = testKeyCode1;
      element.dispatchEvent(keydownEvent);

      expect(callbacks[testKeyCode1]).toHaveBeenCalledWith(keydownEvent);
      expect(callbacks[testKeyCode2]).not.toHaveBeenCalled();

      keydownEvent.keyCode = testKeyCode2;
      element.dispatchEvent(keydownEvent);

      expect(callbacks[testKeyCode2]).toHaveBeenCalledWith(keydownEvent);
    });

    test('should have ability to add callbacks in runtime', () => {
      const testKeyCode = 30;
      const additionCallbacks = {
        [testKeyCode]: jest.fn(),
      };

      interceptor = new KeyboardInterceptor(element);

      keydownEvent.keyCode = testKeyCode;
      element.dispatchEvent(keydownEvent);

      expect(additionCallbacks[testKeyCode]).not.toHaveBeenCalled();

      interceptor.addCallbacks(additionCallbacks);

      keydownEvent.keyCode = testKeyCode;
      element.dispatchEvent(keydownEvent);

      expect(additionCallbacks[testKeyCode]).toHaveBeenCalled();
    });
  });
  test('should clear everything on destroy', () => {
    const testKeyCode = 10;
    const callbacks = {
      [testKeyCode]: jest.fn(),
    };

    interceptor = new KeyboardInterceptor(element, callbacks);

    interceptor.destroy();

    keydownEvent.keyCode = testKeyCode;
    element.dispatchEvent(keydownEvent);

    expect(callbacks[testKeyCode]).not.toHaveBeenCalled();
  });
  test('should call warn on destroy after destroy', () => {
    const warnSpy = jest.spyOn(logger, 'warn');

    interceptor = new KeyboardInterceptor(element);

    interceptor.destroy();
    interceptor.destroy();

    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});
