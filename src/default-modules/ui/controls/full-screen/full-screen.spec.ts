import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { ITooltip, ITooltipService } from '../../core/tooltip';

import createPlayerTestkit from '../../../../testkit';

import { UI_EVENTS } from '../../../../constants/index';
class FullScreenManagerMock {
  enterFullScreen = function() {};
  exitFullScreen = function() {};
  isEnabled = true;
  _config: Object = {};
}

class TooltipServiceMock implements ITooltipService {
  create(): ITooltip {
    return {
      show() {},
      hide() {},
      setTitle() {},
      destroy() {},
    };
  }
  destroy() {}
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
    testkit.registerModuleAsSingleton('tooltipService', TooltipServiceMock);
    fullScreenManager = testkit.getModule('fullScreenManager');
    eventEmitter = testkit.getModule('eventEmitter');
    control = testkit.getModule('fullScreenControl');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exist;
      expect(control.view).to.exist;
    });
  });

  describe('ui events listeners', () => {
    it('should call callback on playback status change', () => {
      const spy = sinon.spy(control, 'setControlStatus');
      control._bindEvents();
      eventEmitter.emit(UI_EVENTS.FULLSCREEN_STATUS_CHANGED);
      expect(spy.called).to.be.true;
    });
  });

  describe('API', () => {
    it('should have method for setting current time', () => {
      const spy = sinon.spy(control.view, 'setState');
      expect(control.setControlStatus).to.exist;
      control.setControlStatus();
      expect(spy.called).to.be.true;
    });

    it('should have method for showing whole view', () => {
      expect(control.show).to.exist;
      control.show();
      expect(control.isHidden).to.be.false;
    });

    it('should have method for hiding whole view', () => {
      expect(control.hide).to.exist;
      control.hide();
      expect(control.isHidden).to.be.true;
    });

    it('should have method for destroying', () => {
      const spy = sinon.spy(control, '_unbindEvents');
      expect(control.destroy).to.exist;
      control.destroy();
      expect(control.view).to.not.exist;
      expect(control._eventEmitter).to.not.exist;
      expect(spy.called).to.be.true;
    });
  });

  describe('internal methods', () => {
    it('should call callbacks from uiView', () => {
      const enterSpy = sinon.spy(fullScreenManager, 'enterFullScreen');
      const exitSpy = sinon.spy(fullScreenManager, 'exitFullScreen');

      control._enterFullScreen();
      expect(enterSpy.called).to.be.true;
      control._exitFullScreen();
      expect(exitSpy.called).to.be.true;

      fullScreenManager.enterFullScreen.restore();
      fullScreenManager.exitFullScreen.restore();
    });
  });

  describe('View', () => {
    it('should react on play/pause icon click', () => {
      const toggleSpy = sinon.spy(control, '_toggleFullScreen');
      control._bindCallbacks();
      control._initUI();

      control.view.$toggleFullScreenControl.trigger('click');
      expect(toggleSpy.called).to.be.true;
    });

    it('should have method for setting current time', () => {
      expect(control.view.setState).to.exist;
    });

    it('should have method for showing itself', () => {
      expect(control.view.show).to.exist;
    });

    it('should have method for hidding itself', () => {
      expect(control.view.hide).to.exist;
    });

    it('should have method gettind root node', () => {
      expect(control.view.getNode).to.exist;
    });

    it('should have method for destroying', () => {
      expect(control.view.destroy).to.exist;
    });
  });
});
