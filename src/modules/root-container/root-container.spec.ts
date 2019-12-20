import EventEmitter from '../event-emitter/event-emitter';
import RootContainer from './root-container';

(global as any).requestAnimationFrame = () => {};

describe('RootContainer', () => {
  let ui: any = {};
  let eventEmitter: any = {};
  let config: any = {};

  beforeEach(() => {
    config = {
      ui: {},
    };
    eventEmitter = new EventEmitter();

    ui = new RootContainer({
      eventEmitter,
      config,
    });
  });

  describe('constructor', () => {
    test('should create instance ', () => {
      expect(ui).toBeDefined();
      expect(ui.view).toBeDefined();
    });
  });

  describe('API', () => {
    beforeEach(() => {
      ui = new RootContainer({
        eventEmitter,
        config,
      });
    });

    test('should have method for setting width', () => {
      expect(ui.setWidth).toBeDefined();
    });

    test('should have method for setting height', () => {
      expect(ui.setHeight).toBeDefined();
    });

    test('should have method for setting setFillAllSpace', () => {
      jest.spyOn(ui.view, 'setFillAllSpaceFlag');
      ui.setFillAllSpace(true);
      expect(ui.view.setFillAllSpaceFlag).toHaveBeenCalledWith(true);
    });

    test('should have method for showing whole view', () => {
      expect(ui.show).toBeDefined();
      ui.show();
      expect(ui.isHidden).toBe(false);
    });

    test('should have method for hiding whole view', () => {
      expect(ui.hide).toBeDefined();
      ui.hide();
      expect(ui.isHidden).toBe(true);
    });

    test('should have method for destroy', () => {
      expect(ui.destroy).toBeDefined();
      ui.destroy();
    });
  });
});
