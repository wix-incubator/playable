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
    test('should create instance ', () => {
      expect(control).toBeDefined();
      expect(control.view).toBeDefined();
    });
  });

  describe('ui events listeners', () => {
    test('should call callback on playback state change', async () => {
      const spy = jest.spyOn(control.view, 'setPictureInPictureState');
      control._bindEvents();
      await eventEmitter.emitAsync(UIEvent.PICTURE_IN_PICTURE_STATUS_CHANGE);
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
});
