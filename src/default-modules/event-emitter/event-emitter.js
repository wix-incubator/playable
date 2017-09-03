import EventEmitter from 'eventemitter3';

import { PUBLIC_API_PROPERTY } from '../../utils/public-api-decorator';


export default function () {
  const eventEmitter = new EventEmitter();

  eventEmitter.destroy = function () {
    this.eventNames().forEach(eventName => {
      this.removeAllListeners(eventName);
    });
  };

  eventEmitter[PUBLIC_API_PROPERTY] = {
    on: Object.getOwnPropertyDescriptor(EventEmitter.prototype, 'on'),
    off: Object.getOwnPropertyDescriptor(EventEmitter.prototype, 'off')
  };

  return eventEmitter;
}
