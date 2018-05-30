import { expect } from 'chai';

import { EventEmitter } from 'eventemitter3';
import { PLAYER_API_PROPERTY } from '../../core/player-api-decorator';

import EventEmitterModule from './event-emitter';

describe('EventEmitterModule', () => {
  let eventEmitter: any;

  beforeEach(() => {
    eventEmitter = new EventEmitterModule();
  });

  it('should return instance of EventEmitter', () => {
    expect(eventEmitter instanceof EventEmitter).to.be.true;
  });

  describe("returned instance's destroy", () => {
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
      expect(eventEmitter[PLAYER_API_PROPERTY].on).to.exist;
    });

    it('should have "off" method', () => {
      expect(eventEmitter[PLAYER_API_PROPERTY].off).to.exist;
    });
  });
});
