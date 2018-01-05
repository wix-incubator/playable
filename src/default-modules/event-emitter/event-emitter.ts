import { EventEmitter, ListenerFn } from 'eventemitter3';

import playerAPI from '../../utils/player-api-decorator';

export default class EventEmitterModule extends EventEmitter {
  /**
   * Method for adding listeners of events inside player.
   * You can check all events inside `VideoPlayer.UI_EVENTS` and `VideoPlayer.VIDEO_EVENTS`
   *
   * @param event - The Event name, such as `VideoPlayer.UI_EVENTS.PLAY_TRIGGERED`
   * @param fn - A function callback to execute when the event is triggered.
   * @param context - Value to use as `this` (i.e the reference Object) when executing callback.
   *
   * @example
   * const VideoPlayer = require('video-player.js');
   * const player = VideoPlayer.create();
   *
   * player.on(VideoPlayer.UI_EVENTS.PLAY_TRIGGERED, () => {
   *   // Will be executed after you will click on play button
   * });
   *
   * // To supply a context value for `this` when the callback is invoked,
   * // pass the optional context argument
   * player.on(VideoPlayer.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);
   */
  @playerAPI()
  on(event: string, fn: ListenerFn, context?: any) {
    return super.on(event, fn, context);
  }

  /**
   * Method for removing listeners of events inside player.
   *
   * @param event - The Event name, such as `VideoPlayer.UI_EVENTS.PLAY_TRIGGERED`
   * @param fn - Only remove the listeners that match this function.
   * @param context - Only remove the listeners that have this context.
   * @param once - Only remove one-time listeners.
   *
   * @example
   * const VideoPlayer = require('video-player.js');
   * const player = VideoPlayer.create();
   *
   * const callback = function() {
   *   // Code to handle some kind of event
   * };
   *
   * // ... Now callback will be called when some one will pause the video ...
   * player.on(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);
   *
   * // ... callback will no longer be called.
   * player.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);
   *
   * // ... remove all handlers for event UI_EVENTS.PAUSE_TRIGGERED.
   * player.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED);
   */
  @playerAPI()
  off(event: string, fn?: ListenerFn, context?: any, once?: boolean) {
    return super.off(event, fn, context, once);
  }

  destroy() {
    this.eventNames().forEach(eventName => {
      this.removeAllListeners(eventName);
    });
  }
}
