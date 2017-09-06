import 'jsdom-global/register';

import { expect } from 'chai';
import sinon from 'sinon';

import EventEmitter from '../event-emitter/event-emitter';
import RootContainer from '../root-container/root-container.controler';
import MouseInterceptor from './mouse-interceptor';

import { UI_EVENTS } from '../../constants/index';


describe('MouseInterceptor', () => {
  let eventEmitter;
  let rootContainer;
  let interceptor;
  let config = {};
  const mouseEnterEvent = new Event('mouseenter');
  const mouseMoveEvent = new Event('mousemove');
  const mouseLeaveEvent = new Event('mouseleave');

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    rootContainer = new RootContainer({
      eventEmitter,
      config
    });

    interceptor = new MouseInterceptor({
      eventEmitter,
      rootContainer
    });
  });

  it('should intercept and broadcast mouse events', () => {
    const emitSpy = sinon.spy(eventEmitter, 'emit');
    rootContainer.node.dispatchEvent(mouseEnterEvent);
    expect(emitSpy.calledWithExactly(UI_EVENTS.MOUSE_ENTER_ON_PLAYER_TRIGGERED)).to.be.true;

    rootContainer.node.dispatchEvent(mouseMoveEvent);
    expect(emitSpy.calledWithExactly(UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED)).to.be.true;

    rootContainer.node.dispatchEvent(mouseLeaveEvent);
    expect(emitSpy.calledWithExactly(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED)).to.be.true;
  });

  it('should clear everything on destroy', () => {
    const emitSpy = sinon.spy(eventEmitter, 'emit');
    interceptor.destroy();
    rootContainer.node.dispatchEvent(mouseEnterEvent);
    rootContainer.node.dispatchEvent(mouseMoveEvent);
    rootContainer.node.dispatchEvent(mouseLeaveEvent);
    expect(emitSpy.called).to.be.false;
  })
});
