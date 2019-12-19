import * as sinon from 'sinon';

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
      const processClickSpy = sinon.spy(screen, '_processClick');
      screen._bindCallbacks();
      screen._initUI();

      screen.view.getElement().dispatchEvent(new Event('click'));
      expect(processClickSpy.called).toBe(true);
    });

    test('should remove timeout of delayed playback change on _processClick and call _toggleFullScreen on _processDblClick', () => {
      const timeoutClearSpy = sinon.spy<Window, 'clearTimeout'>(
        window,
        'clearTimeout',
      );
      const toggleFullScreenSpy = sinon.spy(screen, '_toggleFullScreen');
      const id = window.setTimeout(() => {}, 0);
      screen._delayedToggleVideoPlaybackTimeout = id;

      screen._processClick();
      expect(timeoutClearSpy.calledWith(id)).toBe(true);
      screen._processDblClick();
      expect(toggleFullScreenSpy.called).toBe(true);

      timeoutClearSpy.restore();
    });

    test('should add native controls if config passed', () => {
      testkit.setConfig({
        nativeBrowserControls: true,
      });

      const video: any = document.createElement('video');

      video.setAttribute = sinon.spy();

      engine.getElement = () => video;

      screen = testkit.getModule('screen');

      expect(video.setAttribute.calledWith('controls', 'true')).toBe(true);
    });

    test('should emit ui event on enter full screen', () => {
      const spy = sinon.spy(fullScreenManager, 'enterFullScreen');
      fullScreenManager.isInFullScreen = false;

      screen._toggleFullScreen();

      expect(spy.called).toBe(true);
      fullScreenManager.enterFullScreen.restore();
    });

    test('should emit ui event on exit full screen', () => {
      const spy = sinon.spy(fullScreenManager, 'exitFullScreen');
      fullScreenManager.isInFullScreen = true;

      screen._toggleFullScreen();

      expect(spy.called).toBe(true);
      fullScreenManager.exitFullScreen.restore();
    });

    test('should have method for toggling playback', () => {
      const playSpy = sinon.spy();
      const pauseSpy = sinon.spy();
      screen._engine = {
        getCurrentState: () => EngineState.PLAYING,
        play: playSpy,
        pause: pauseSpy,
      };
      screen._toggleVideoPlayback();
      expect(pauseSpy.called).toBe(true);
    });
  });
});
