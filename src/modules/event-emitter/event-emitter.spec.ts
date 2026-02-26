import { EventEmitter } from 'eventemitter3';
import { PLAYER_API_PROPERTY } from '../../core/player-api-decorator';

import EventEmitterModule from './event-emitter';

describe('EventEmitterModule', () => {
  let eventEmitter: any;

  beforeEach(() => {
    eventEmitter = new EventEmitterModule();
  });

  it('should return instance of EventEmitter', () => {
    expect(eventEmitter instanceof EventEmitter).toBe(true);
  });

  describe("returned instance's destroy", () => {
    beforeEach(() => {
      eventEmitter.on('EVENT', () => {});
      eventEmitter.on('EVENT2', () => {});
    });

    it('should remove all listeners for all events', () => {
      eventEmitter.destroy();
      expect(eventEmitter.eventNames()).toEqual([]);
    });
  });

  describe('public API', () => {
    it('should have "on" method', () => {
      expect(eventEmitter[PLAYER_API_PROPERTY].on).toBeDefined();
    });

    it('should have "off" method', () => {
      expect(eventEmitter[PLAYER_API_PROPERTY].off).toBeDefined();
    });

    it('should have "once" method', () => {
      expect(eventEmitter[PLAYER_API_PROPERTY].once).toBeDefined();
    });
  });
});
