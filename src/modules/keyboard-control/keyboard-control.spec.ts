import 'jsdom-global/register';

import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import { KEYCODES } from '../../utils/keyboard-interceptor';
import { UI_EVENTS } from '../../constants';

import Engine from '../playback-engine/playback-engine';
import EventEmitter from '../event-emitter/event-emitter';
import RootContainer from '../root-container/root-container';
import KeyboardControl, {
  AMOUNT_TO_SKIP_SECONDS,
  AMOUNT_TO_CHANGE_VOLUME,
} from './keyboard-control';

describe('KeyboardControl', () => {
  const keyDownEvent: any = new Event('keydown');
  keyDownEvent.preventDefault = sinon.spy();

  let config;
  let engine: any;
  let eventEmitter: any;
  let rootContainer: any;
  let keyboardControl: any;

  beforeEach(() => {
    config = {};
    eventEmitter = new EventEmitter();
    engine = new Engine({
      eventEmitter,
      config,
      availablePlaybackAdapters: [],
    });
    engine._adapterStrategy._attachedAdapter = {
      isSeekAvailable: true,
      attach: () => {},
      detach: () => {},
    };
    rootContainer = new RootContainer({
      eventEmitter,
      config,
    });
    keyboardControl = new KeyboardControl({
      eventEmitter,
      engine,
      rootContainer,
      config,
    });
  });

  afterEach(() => {
    keyDownEvent.preventDefault.resetHistory();

    eventEmitter.destroy();
    engine.destroy();
    rootContainer.destroy();
  });

  describe('as a reaction on press of key', () => {
    beforeEach(() => {
      sinon.spy(eventEmitter, 'emit');
      delete keyDownEvent.keyCode;
    });

    afterEach(() => {
      eventEmitter.emit.restore();
      keyboardControl.destroy();
    });

    it('should do stuff if key was TAB', () => {
      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.node.dispatchEvent(keyDownEvent);

      expect(
        eventEmitter.emit.calledWith(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
    });

    it('should do stuff if key was TAB', () => {
      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.node.dispatchEvent(keyDownEvent);

      expect(
        eventEmitter.emit.calledWith(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
    });

    it('should do stuff if key was SPACE_BAR', () => {
      sinon.stub(engine, 'togglePlayback');
      keyDownEvent.keyCode = KEYCODES.SPACE_BAR;
      rootContainer.node.dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emit.calledWith(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emit.calledWith(
          UI_EVENTS.TOGGLE_PLAYBACK_WITH_KEYBOARD_TRIGGERED,
        ),
      ).to.be.true;
      expect(engine.togglePlayback.called).to.be.true;

      engine.togglePlayback.restore();
    });

    it('should do stuff if key was LEFT_ARROW', () => {
      sinon.stub(engine, 'goBackward');
      keyDownEvent.keyCode = KEYCODES.LEFT_ARROW;
      rootContainer.node.dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emit.calledWith(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emit.calledWith(
          UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD_TRIGGERED,
        ),
      ).to.be.true;
      expect(engine.goBackward.calledWith(AMOUNT_TO_SKIP_SECONDS)).to.be.true;

      engine.goBackward.restore();
    });

    it('should do stuff if key was RIGHT_ARROW', () => {
      sinon.stub(engine, 'goForward');
      keyDownEvent.keyCode = KEYCODES.RIGHT_ARROW;
      rootContainer.node.dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emit.calledWith(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emit.calledWith(
          UI_EVENTS.GO_FORWARD_WITH_KEYBOARD_TRIGGERED,
        ),
      ).to.be.true;
      expect(engine.goForward.calledWith(AMOUNT_TO_SKIP_SECONDS)).to.be.true;

      engine.goForward.restore();
    });

    it('should do stuff if key was UP_ARROW', () => {
      sinon.stub(engine, 'increaseVolume');
      keyDownEvent.keyCode = KEYCODES.UP_ARROW;
      rootContainer.node.dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emit.calledWith(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emit.calledWith(
          UI_EVENTS.INCREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
        ),
      ).to.be.true;
      expect(engine.increaseVolume.calledWith(AMOUNT_TO_CHANGE_VOLUME)).to.be
        .true;

      engine.increaseVolume.restore();
    });

    it('should do stuff if key was DOWN_ARROW', () => {
      sinon.stub(engine, 'decreaseVolume');
      keyDownEvent.keyCode = KEYCODES.DOWN_ARROW;
      rootContainer.node.dispatchEvent(keyDownEvent);

      expect(keyDownEvent.preventDefault.called).to.be.true;
      expect(
        eventEmitter.emit.calledWith(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED),
      ).to.be.true;
      expect(
        eventEmitter.emit.calledWith(
          UI_EVENTS.DECREASE_VOLUME_WITH_KEYBOARD_TRIGGERED,
        ),
      ).to.be.true;
      expect(engine.decreaseVolume.calledWith(AMOUNT_TO_CHANGE_VOLUME)).to.be
        .true;

      engine.decreaseVolume.restore();
    });
  });

  describe('after destroy', () => {
    it('should not react on key down', () => {
      sinon.spy(eventEmitter, 'emit');
      keyboardControl.destroy();

      keyDownEvent.keyCode = KEYCODES.TAB;
      rootContainer.node.dispatchEvent(keyDownEvent);

      expect(eventEmitter.emit.called).to.be.false;
      eventEmitter.emit.restore();
    });
  });
});
