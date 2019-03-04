import 'jsdom-global/register';

import { expect } from 'chai';

import * as sinon from 'sinon';

import { KEYCODES } from '../../utils/keyboard-interceptor';
import { UIEvent } from '../../constants';

import createPlayerTestkit from '../../testkit';

import {
  AMOUNT_TO_SKIP_SECONDS,
  AMOUNT_TO_CHANGE_VOLUME,
} from './keyboard-control';

describe('KeyboardControl', () => {
  const keyDownEvent: any = new Event('keydown');
  keyDownEvent.preventDefault = sinon.spy();
  let testkit: any;
  let engine: any;
  let eventEmitter: any;
  let rootContainer: any;
  let keyboardControl: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
    eventEmitter = testkit.getModule('eventEmitter');
    engine = testkit.getModule('engine');
    engine._adapterStrategy._attachedAdapter = {
      isSeekAvailable: true,
      attach: () => {},
      detach: () => {},
    };
    rootContainer = testkit.getModule('rootContainer');
    keyboardControl = testkit.getModule('keyboardControl');
  });

  afterEach(() => {
    keyDownEvent.preventDefault.resetHistory();
  });

  describe('as a reaction on press of key', () => {
    beforeEach(() => {
      sinon.spy(eventEmitter, 'emitAsync');
      delete keyDownEvent.keyCode;
    });

    afterEach(() => {
      eventEmitter.emitAsync.restore();
      keyboardControl.destroy();
    });

    it('should do stuff if key was TAB', () => {
      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
    });

    it('should do stuff if key was TAB', () => {
      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
    });

    it('should do stuff if key was SPACE_BAR', () => {
      sinon.stub(engine, 'togglePlayback');
      keyDownEvent.keyCode = KEYCODES.SPACE_BAR;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(
          UIEvent.TOGGLE_PLAYBACK_WITH_KEYBOARD,
        ),
      ).to.be.true;
      expect(engine.togglePlayback.called).to.be.true;

      engine.togglePlayback.restore();
    });

    it('should do stuff if key was LEFT_ARROW', () => {
      sinon.stub(engine, 'seekBackward');
      keyDownEvent.keyCode = KEYCODES.LEFT_ARROW;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.GO_BACKWARD_WITH_KEYBOARD),
      ).to.be.true;
      expect(engine.seekBackward.calledWith(AMOUNT_TO_SKIP_SECONDS)).to.be.true;

      engine.seekBackward.restore();
    });

    it('should do stuff if key was RIGHT_ARROW', () => {
      sinon.stub(engine, 'seekForward');
      keyDownEvent.keyCode = KEYCODES.RIGHT_ARROW;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.GO_FORWARD_WITH_KEYBOARD),
      ).to.be.true;
      expect(engine.seekForward.calledWith(AMOUNT_TO_SKIP_SECONDS)).to.be.true;

      engine.seekForward.restore();
    });

    it('should do stuff if key was UP_ARROW', () => {
      sinon.stub(engine, 'increaseVolume');
      keyDownEvent.keyCode = KEYCODES.UP_ARROW;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(
          UIEvent.INCREASE_VOLUME_WITH_KEYBOARD,
        ),
      ).to.be.true;
      expect(engine.increaseVolume.calledWith(AMOUNT_TO_CHANGE_VOLUME)).to.be
        .true;

      engine.increaseVolume.restore();
    });

    it('should do stuff if key was DOWN_ARROW', () => {
      sinon.stub(engine, 'decreaseVolume');
      keyDownEvent.keyCode = KEYCODES.DOWN_ARROW;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(UIEvent.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emitAsync.calledWith(
          UIEvent.DECREASE_VOLUME_WITH_KEYBOARD,
        ),
      ).to.be.true;
      expect(engine.decreaseVolume.calledWith(AMOUNT_TO_CHANGE_VOLUME)).to.be
        .true;

      engine.decreaseVolume.restore();
    });
  });

  describe('after destroy', () => {
    it('should not react on key down', () => {
      sinon.spy(eventEmitter, 'emitAsync');
      keyboardControl.destroy();

      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.getElement().dispatchEvent(keyDownEvent);

      expect(eventEmitter.emitAsync.called).to.be.false;
      eventEmitter.emitAsync.restore();
    });
  });
});
