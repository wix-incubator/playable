import { EventEmitter, ListenerFn } from 'eventemitter3';

import playerAPI from '../../utils/player-api-decorator';

export default class EventEmitterModule extends EventEmitter {
  /**
   *  Method for adding listeners of events inside player.
   *  You can check all events inside `VideoPlayer.UI_EVENTS` and `VideoPlayer.VIDEO_EVENTS`
   */
  @playerAPI()
  on(event: string, fn: ListenerFn, context) {
    return super.on(event, fn, context);
  }

  /**
   * Method for removing listeners of events inside player.
   */
  @playerAPI()
  off(event: string, fn: ListenerFn, context, once?: boolean) {
    return super.off(event, fn, context, once);
  }

  destroy() {
    this.eventNames().forEach(eventName => {
      this.removeAllListeners(eventName);
    });
  }
}
