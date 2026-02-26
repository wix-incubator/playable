import { KEYCODES } from '../../utils/keyboard-interceptor';
import { UIEvent } from '../../constants';

import createPlayerTestkit from '../../testkit';

import {
  AMOUNT_TO_SKIP_SECONDS,
  AMOUNT_TO_CHANGE_VOLUME,
} from './keyboard-control';

describe('KeyboardControl', () => {
  const keyDownEvent: any = new Event('keydown');
  keyDownEvent.preventDefault = vi.fn();
  let testkit: any;
  let engine: any;
  let eventEmitter: any;
  let rootContainer: any;
  let keyboardControl: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    eventEmitter = testkit.getModule('eventEmitter');
    engine = testkit.getModule('engine');
    engine._output._adapterStrategy._attachedAdapter = {
      isSeekAvailable: true,
      attach: () => {},
      detach: () => {},
    };
    rootContainer = testkit.getModule('rootContainer');
    keyboardControl = testkit.getModule('keyboardControl');
  });

  afterEach(() => {
    keyDownEvent.preventDefault.mockClear();
  });

  describe('as a reaction on press of key', () => {
    beforeEach(() => {
      vi.spyOn(eventEmitter, 'emitAsync');
      delete keyDownEvent.keyCode;
    });

    afterEach(() => {
      eventEmitter.emitAsync.mockRestore();
      keyboardControl.destroy();
    });

    it('should do stuff if key was TAB', () => {
      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED,
      );
    });

    it('should do stuff if key was TAB', () => {
      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED,
      );
    });

    it('should do stuff if key was SPACE_BAR', () => {
      vi.spyOn(engine, 'togglePlayback');
      keyDownEvent.keyCode = KEYCODES.SPACE_BAR;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault).toHaveBeenCalled();
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED,
      );
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.TOGGLE_PLAYBACK_WITH_KEYBOARD,
      );
      expect(engine.togglePlayback).toHaveBeenCalled();

      engine.togglePlayback.mockRestore();
    });

    it('should do stuff if key was LEFT_ARROW', () => {
      vi.spyOn(engine, 'seekBackward');
      keyDownEvent.keyCode = KEYCODES.LEFT_ARROW;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault).toHaveBeenCalled();
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED,
      );
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.GO_BACKWARD_WITH_KEYBOARD,
      );
      expect(engine.seekBackward).toHaveBeenCalledWith(AMOUNT_TO_SKIP_SECONDS);

      engine.seekBackward.mockRestore();
    });

    it('should do stuff if key was RIGHT_ARROW', () => {
      vi.spyOn(engine, 'seekForward');
      keyDownEvent.keyCode = KEYCODES.RIGHT_ARROW;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault).toHaveBeenCalled();
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED,
      );
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.GO_FORWARD_WITH_KEYBOARD,
      );
      expect(engine.seekForward).toHaveBeenCalledWith(AMOUNT_TO_SKIP_SECONDS);

      engine.seekForward.mockRestore();
    });

    it('should do stuff if key was UP_ARROW', () => {
      vi.spyOn(engine, 'increaseVolume');
      keyDownEvent.keyCode = KEYCODES.UP_ARROW;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault).toHaveBeenCalled();
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED,
      );
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.INCREASE_VOLUME_WITH_KEYBOARD,
      );
      expect(engine.increaseVolume).toHaveBeenCalledWith(
        AMOUNT_TO_CHANGE_VOLUME,
      );

      engine.increaseVolume.mockRestore();
    });

    it('should do stuff if key was DOWN_ARROW', () => {
      vi.spyOn(engine, 'decreaseVolume');
      keyDownEvent.keyCode = KEYCODES.DOWN_ARROW;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault).toHaveBeenCalled();
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED,
      );
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
        UIEvent.DECREASE_VOLUME_WITH_KEYBOARD,
      );
      expect(engine.decreaseVolume).toHaveBeenCalledWith(
        AMOUNT_TO_CHANGE_VOLUME,
      );

      engine.decreaseVolume.mockRestore();
    });
  });

  describe('after destroy', () => {
    it('should not react on key down', () => {
      vi.spyOn(eventEmitter, 'emitAsync');
      keyboardControl.destroy();

      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(eventEmitter.emitAsync).not.toHaveBeenCalled();
      eventEmitter.emitAsync.mockRestore();
    });
  });
});
