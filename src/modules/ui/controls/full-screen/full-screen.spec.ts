import createPlayerTestkit from '../../../../testkit';

import { UIEvent } from '../../../../constants';
class FullScreenManagerMock {
  enterFullScreen = function() {};
  exitFullScreen = function() {};
  isEnabled = true;
  _config: Object = {};
}

describe('FullScreenControl', () => {
  let testkit;
  let control: any = {};
  let eventEmitter: any = {};
  let fullScreenManager: any = {};

  beforeEach(() => {
    testkit = createPlayerTestkit();
    testkit.registerModuleAsSingleton(
      'fullScreenManager',
      FullScreenManagerMock,
    );
    fullScreenManager = testkit.getModule('fullScreenManager');
    eventEmitter = testkit.getModule('eventEmitter');
    control = testkit.getModule('fullScreenControl');
  });

  describe('constructor', () => {
    test('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('ui events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = jest.spyOn(control.view, 'setFullScreenState');
      control._bindEvents();
      await eventEmitter.emitAsync(UIEvent.FULL_SCREEN_STATE_CHANGED);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('API', () => {
    test('should have method for showing whole view', () => {
      expect(control.show).toBeDefined();
      control.show();
      expect(control.isHidden).toBe(false);
    });

    test('should have method for hiding whole view', () => {
      expect(control.hide).toBeDefined();
      control.hide();
      expect(control.isHidden).toBe(true);
    });

    test('should have method for destroying', () => {
      const spy = jest.spyOn(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('internal methods', () => {
    test('should call callbacks from uiView', () => {
      const enterSpy = jest.spyOn(fullScreenManager, 'enterFullScreen');
      const exitSpy = jest.spyOn(fullScreenManager, 'exitFullScreen');

      control._toggleFullScreen();
      expect(enterSpy).toHaveBeenCalled();
      fullScreenManager.isInFullScreen = true;
      control._toggleFullScreen();
      expect(exitSpy).toHaveBeenCalled();

      fullScreenManager.enterFullScreen.mockRestore();
      fullScreenManager.exitFullScreen.mockRestore();
    });
  });
});
