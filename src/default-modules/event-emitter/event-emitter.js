import EventEmitter from 'eventemitter3';


export default function () {
  const eventEmitter = new EventEmitter();

  eventEmitter.destroy = function () {
    this.eventNames().forEach(eventName => {
      this.removeAllListeners(eventName);
    });
  };

  eventEmitter._publicAPI = {
    on: Object.getOwnPropertyDescriptor(EventEmitter.prototype, 'on'),
    off: Object.getOwnPropertyDescriptor(EventEmitter.prototype, 'off')
  };

  return eventEmitter;
}
