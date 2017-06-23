import EventEmitter from 'eventemitter3';

export default function () {
  const eventEmitter = new EventEmitter();

  eventEmitter.destroy = function () {
    this.eventNames().forEach(eventName => {
      this.removeAllListeners(eventName);
    });
  };

  return eventEmitter;
}
