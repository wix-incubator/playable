import EventEmitter from 'eventemitter3';

import playerAPI from '../../utils/player-api-decorator';


export default class EventEmitterModule extends EventEmitter {
  @playerAPI()
  on(event, fn, context) {
    return super.on(event, fn, context);
  }

  @playerAPI()
  off(event, fn, context, once) {
    return super.off(event, fn, context, once);
  }

  destroy() {
    this.eventNames().forEach(eventName => {
      this.removeAllListeners(eventName);
    });
  }
}
