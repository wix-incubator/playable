import { EngineState } from '../../../constants';

import createPlayerTestkit from '../../../testkit';

import Screen from './screen';
class FullScreenManagerMock {
  enterFullScreen = (_: any) => _;
  exitFullScreen = (_: any) => _;
  isInFullScreen = false;
  isEnabled = true;
  _config = {};
}

describe('Loader', () => {
  let testkit: any;
  let screen: any;
  let engine: any;
  let fullScreenManager: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    testkit.registerModuleAsSingleton(
      'fullScreenManager',
      FullScreenManagerMock,
    );
    testkit.registerModule('screen', Screen);
    engine = testkit.getModule('engine');
    fullScreenManager = testkit.getModule('fullScreenManager');
    screen = testkit.getModule('screen');
  });

  describe('constructor', () => {
    test('should create instance ', () => {
      expect(screen).toBeDefined();
      expect(screen.view).toBeDefined();
    });
  });

  describe('instance callbacks', () => {
    test('should trigger _toggleVideoPlayback on node click', () => {
      const processClickSpy = jest.spyOn(screen, '_processClick');
      screen._bindCallbacks();
      screen._initUI();

      screen.view.getElement().dispatchEvent(new Event('click'));
      expect(processClickSpy).toHaveBeenCalled;
    });

    test('should remove timeout of delayed playback change on _processClick and call _toggleFullScreen on _processDblClick', () => {
      const timeoutClearSpy = jest.spyOn<Window, 'clearTimeout'>(
        window,
        'clearTimeout',
      );
      const toggleFullScreenSpy = jest.spyOn(screen, '_toggleFullScreen');
      const id = window.setTimeout(() => {}, 0);
      screen._delayedToggleVideoPlaybackTimeout = id;

      screen._processClick();
      expect(timeoutClearSpy).toHaveBeenCalledWith(id);
      screen._processDblClick();
      expect(toggleFullScreenSpy).toHaveBeenCalled;

      timeoutClearSpy.mockRestore();
    });

    test('should add native controls if config passed', () => {
      testkit.setConfig({
        nativeBrowserControls: true,
      });

      const video: any = document.createElement('video');

      video.setAttribute = jest.fn();

      engine.getElement = () => video;

      screen = testkit.getModule('screen');

      expect(video.setAttribute).toHaveBeenCalledWith('controls', 'true');
    });

    test('should emit ui event on enter full screen', () => {
      const spy = jest.spyOn(fullScreenManager, 'enterFullScreen');
      fullScreenManager.isInFullScreen = false;

      screen._toggleFullScreen();

      expect(spy).toHaveBeenCalled();
      fullScreenManager.enterFullScreen.mockRestore();
    });

    test('should emit ui event on exit full screen', () => {
      const spy = jest.spyOn(fullScreenManager, 'exitFullScreen');
      fullScreenManager.isInFullScreen = true;

      screen._toggleFullScreen();

      expect(spy).toHaveBeenCalled();
      fullScreenManager.exitFullScreen.mockRestore();
    });

    test('should have method for toggling playback', () => {
      const playSpy = jest.fn();
      const pauseSpy = jest.fn();
      screen._engine = {
        getCurrentState: () => EngineState.PLAYING,
        play: playSpy,
        pause: pauseSpy,
      };
      screen._toggleVideoPlayback();
      expect(pauseSpy).toHaveBeenCalled();
    });
  });
});
