import 'jsdom-global/register';
import { expect } from 'chai';
//@ts-ignore
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
    it('should create instance ', () => {
      expect(screen).to.exist;
      expect(screen.view).to.exist;
    });
  });

  describe('instance callbacks', () => {
    it('should trigger _toggleVideoPlayback on node click', () => {
      const processClickSpy = sinon.spy(screen, '_processNodeClick');
      screen._bindCallbacks();
      screen._initUI();

      screen.view.getNode().dispatchEvent(new Event('click'));
      expect(processClickSpy.called).to.be.true;
    });

    it('should remove timeout of delayed playback change on _processNodeClick and call _toggleFullScreen on _processNodeDblClick', () => {
      const timeoutClearSpy = sinon.spy(window, 'clearTimeout');
      const toggleFullScreenSpy = sinon.spy(screen, '_toggleFullScreen');
      const id = window.setTimeout(() => {}, 0);
      screen._delayedToggleVideoPlaybackTimeout = id;

      screen._processNodeClick();
      expect(timeoutClearSpy.calledWith(id)).to.be.true;
      screen._processNodeDblClick();
      expect(toggleFullScreenSpy.called).to.be.true;

      timeoutClearSpy.restore();
    });

    it('should add native controls if config passed', () => {
      testkit.setConfig({
        screen: {
          nativeControls: true,
        },
      });

      const video: any = document.createElement('video');

      video.setAttribute = sinon.spy();

      engine.getNode = () => video;

      screen = testkit.getModule('screen');

      expect(video.setAttribute.calledWith('controls', 'true')).to.be.true;
    });

    it('should emit ui event on enter full screen', () => {
      const spy = sinon.spy(fullScreenManager, 'enterFullScreen');
      fullScreenManager.isInFullScreen = false;

      screen._toggleFullScreen();

      expect(spy.called).to.be.true;
      fullScreenManager.enterFullScreen.restore();
    });

    it('should emit ui event on exit full screen', () => {
      const spy = sinon.spy(fullScreenManager, 'exitFullScreen');
      fullScreenManager.isInFullScreen = true;

      screen._toggleFullScreen();

      expect(spy.called).to.be.true;
      fullScreenManager.exitFullScreen.restore();
    });

    it('should have method for toggling playback', () => {
      const playSpy = sinon.spy();
      const pauseSpy = sinon.spy();
      screen._engine = {
        getCurrentState: () => EngineState.PLAYING,
        play: playSpy,
        pause: pauseSpy,
      };
      screen._toggleVideoPlayback();
      expect(pauseSpy.called).to.be.true;
    });
  });
});
