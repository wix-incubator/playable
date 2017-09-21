import EventEmitter from 'eventemitter3';

import publicAPI from '../../utils/public-api-decorator';


export default class EventEmitterModule extends EventEmitter {
  @publicAPI()
  on(event, fn, context) {
    return super.on(event, fn, context);
  }

  @publicAPI()
  off(event, fn, context, once) {
    return super.off(event, fn, context, once);
  }

  destroy() {
    this.eventNames().forEach(eventName => {
      this.removeAllListeners(eventName);
    });
  }
}
