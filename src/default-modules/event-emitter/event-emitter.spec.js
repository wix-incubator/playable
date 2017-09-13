import { expect } from 'chai';

import EventEmitter from 'eventemitter3';
import { PUBLIC_API_PROPERTY } from '../../utils/public-api-decorator';


import eventEmitterWrapper from './event-emitter';

describe('eventEmitterWrapper' , () => {
  let eventEmitter;

  beforeEach(() => {
    eventEmitter = eventEmitterWrapper();
  });

  it('should return instance of EventEmitter', () => {
    expect(eventEmitter instanceof EventEmitter).to.be.true;
  });

  describe('returned instance\'s destroy', () => {
    beforeEach(() => {
      eventEmitter.on('EVENT', () => {});
      eventEmitter.on('EVENT2', () => {});
    });

    it('should remove all listeners for all events', () => {
      eventEmitter.destroy();
      expect(eventEmitter.eventNames()).to.be.deep.equal([]);
    });
  });

  describe('public API', () => {
    it('should have "on" method', () => {
      expect(eventEmitter[PUBLIC_API_PROPERTY].on).to.be.defined;
    });

    it('should have "off" method', () => {
      expect(eventEmitter[PUBLIC_API_PROPERTY].off).to.be.defined;
    });
  });
});