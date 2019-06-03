import 'jsdom-global/register';
import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../../testkit';

import { UIEvent } from '../../../../constants';

class PictureInPictureMock {
  enterPictureInPicture = function() {};
  exitPictureInPicture = function() {};
  isEnabled = true;
  _config: Object = {};
}

describe('PictureInPictureControl', () => {
  let testkit;
  let control: any = {};
  let eventEmitter: any = {};

  beforeEach(() => {
    testkit = createPlayerTestkit();
    testkit.registerModule('pictureInPicture', PictureInPictureMock);
    eventEmitter = testkit.getModule('eventEmitter');
    control = testkit.getModule('pictureInPictureControl');
  });

  describe('constructor', () => {
    it('should create instance ', () => {
      expect(control).to.exist;
      expect(control.view).to.exist;
    });
  });

  describe('ui events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = sinon.spy(control.view, 'setPictureInPictureState');
      control._bindEvents();
      await eventEmitter.emitAsync(UIEvent.PICTURE_IN_PICTURE_STATUS_CHANGE);
      expect(spy.called).to.be.true;
    });
  });

  describe('API', () => {
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
      expect(spy.called).to.be.true;
    });
  });
});
