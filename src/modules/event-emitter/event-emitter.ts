import { EventEmitter, ListenerFn } from 'eventemitter3';

import playerAPI from '../../core/player-api-decorator';

import { IEventEmitter, IEventMap, IEventEmitterAPI } from './types';
import { isPromiseAvailable } from '../../utils/promise';

class EventEmitterModule extends EventEmitter implements IEventEmitter {
  static moduleName = 'eventEmitter';

  /**
   * Attach an event handler function for one or more events
   * You can check all events [here](/events)
   *
   * @param event - The Event name, such as `Playable.UI_EVENTS.PLAY_CLICK`
   * @param fn - A function callback to execute when the event is triggered.
   * @param context - Value to use as `this` (i.e the reference Object) when executing callback.
   *
   * @example
   * const Playable = require('playable');
   * const player = Playable.create();
   *
   * player.on(Playable.UI_EVENTS.PLAY_CLICK, () => {
   *   // Will be executed after you will click on play button
   * });
   *
   * // To supply a context value for `this` when the callback is invoked,
   * // pass the optional context argument
   * player.on(Playable.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);
   */
  @playerAPI()
  on(event: string, fn: ListenerFn, context?: any) {
    return super.on(event, fn, context);
  }

  /**
   * The `.once()` method is identical to `.on()`, except that the handler for a given element and event type is unbound after its first invocation.
   *
   * @param event - The Event name, such as `Playable.UI_EVENTS.PLAY_CLICK`
   * @param fn - A function callback to execute when the event is triggered.
   * @param context - Value to use as `this` (i.e the reference Object) when executing callback.
   *
   * @example
   * const Playable = require('playable');
   * const player = Playable.create();
   *
   * player.once(Playable.UI_EVENTS.PLAY_CLICK, () => {
   *   // Will be executed only one time
   * });
   */
  @playerAPI()
  once(event: string, fn: ListenerFn, context?: any) {
    return super.once(event, fn, context);
  }

  /**
   * Remove an event handler.
   *
   * @param event - The Event name, such as `Playable.UI_EVENTS.PLAY_CLICK`
   * @param fn - Only remove the listeners that match this function.
   * @param context - Only remove the listeners that have this context.
   * @param once - Only remove one-time listeners.
   *
   * @example
   * const Playable = require('playable');
   * const player = Playable.create();
   *
   * const callback = function() {
   *   // Code to handle some kind of event
   * };
   *
   * // ... Now callback will be called when some one will pause the video ...
   * player.on(Playable.UI_EVENTS.PAUSE, callback);
   *
   * // ... callback will no longer be called.
   * player.off(Playable.UI_EVENTS.PAUSE, callback);
   *
   * // ... remove all handlers for event UI_EVENTS.PAUSE.
   * player.off(Playable.UI_EVENTS.PAUSE);
   */
  @playerAPI()
  off(event: string, fn?: ListenerFn, context?: any, once?: boolean) {
    return super.off(event, fn, context, once);
  }

  /**
   * Method for binding array of listeners with events inside player.
   *
   * @example
   *
   * this._unbindEvents = this._eventEmitter.bindEvents([
   *     [Playable.VIDEO_EVENTS.STATE_CHANGED, this._processStateChange],
   *     [Playable.VIDEO_EVENTS.LIVE_STATE_CHANGED, this._processLiveStateChange],
   *     [Playable.VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator],
   *     [Playable.VIDEO_EVENTS.DURATION_UPDATED, this._updateAllIndicators],
   *   ],
   *   this,
   * );
   *
   * //...
   *
   * this._unbindEvents()
   *
   * @param eventsMap
   * @param defaultFnContext
   * @returns unbindEvents
   */
  bindEvents(eventsMap: IEventMap[], defaultFnContext?: Object): () => void {
    const events: (() => void)[] = [];

    eventsMap.forEach(([eventName, fn, fnContext = defaultFnContext]) => {
      this.on(eventName, fn, fnContext);
      events.push(() => {
        this.off(eventName, fn, fnContext);
      });
    });

    return () => {
      events.forEach(unbindEvent => {
        unbindEvent();
      });
    };
  }

  //Now emit fire events only at the end of current macrotask, as part as next microtask
  emitAsync(event: string | symbol, ...args: any[]): Promise<boolean> | void {
    //Handle IE11
    if (!isPromiseAvailable) {
      if (setImmediate) {
        setImmediate(() => super.emit(event, ...args));
      } else {
        setTimeout(() => super.emit(event, ...args));
      }
    } else {
      return Promise.resolve().then(() => super.emit(event, ...args));
    }
  }

  destroy() {
    this.removeAllListeners();
  }
}

export { IEventEmitterAPI };
export default EventEmitterModule;
