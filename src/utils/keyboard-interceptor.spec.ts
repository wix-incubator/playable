import 'jsdom-global/register';

import { expect } from 'chai';
//@ts-ignore
import * as sinon from 'sinon';

import KeyboardInterceptor from './keyboard-interceptor';

describe('KeyboardInterceptor', () => {
  let node: any;
  let callbacks: any;
  let interceptor: any;
  const keydownEvent: any = new Event('keydown');
  const testKeyCode1 = 10;
  const testKeyCode2 = 20;

  beforeEach(() => {
    node = document.createElement('div');
    callbacks = {
      [testKeyCode1]: sinon.spy(),
      [testKeyCode2]: sinon.spy(),
    };

    interceptor = new KeyboardInterceptor(node, callbacks);
  });

  it('should intercept and broadcast keydown events', () => {
    keydownEvent.keyCode = testKeyCode1;
    node.dispatchEvent(keydownEvent);

    expect(callbacks[testKeyCode1].calledWith(keydownEvent)).to.be.true;
    expect(callbacks[testKeyCode2].called).to.be.false;

    keydownEvent.keyCode = testKeyCode2;
    node.dispatchEvent(keydownEvent);

    expect(callbacks[testKeyCode2].calledWith(keydownEvent)).to.be.true;
  });

  it('should clear everything on destroy', () => {
    interceptor.destroy();

    keydownEvent.keyCode = testKeyCode1;
    node.dispatchEvent(keydownEvent);

    expect(callbacks[testKeyCode1].called).to.be.false;
  });
});
