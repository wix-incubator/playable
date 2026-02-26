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
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('ui events listeners', () => {
    it('should call callback on playback state change', async function() {
      const spy = vi.spyOn(control.view, 'setPictureInPictureState');
      control._bindEvents();
      await eventEmitter.emitAsync(UIEvent.PICTURE_IN_PICTURE_STATUS_CHANGE);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('API', () => {
    it('should have method for showing whole view', () => {
      expect(control.show).toBeDefined();
      control.show();
      expect(control.isHidden).toBe(false);
    });

    it('should have method for hiding whole view', () => {
      expect(control.hide).toBeDefined();
      control.hide();
      expect(control.isHidden).toBe(true);
    });

    it('should have method for destroying', () => {
      const spy = vi.spyOn(control, '_unbindEvents');
      expect(control.destroy).toBeDefined();
      control.destroy();
      expect(spy).toHaveBeenCalled();
    });
  });
});
