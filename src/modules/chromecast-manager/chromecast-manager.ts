import { IChromecastManager } from './types';
import { IPlaybackEngine } from '../playback-engine/types';
import CastContext = cast.framework.CastContext;
import CastStateEventData = cast.framework.CastStateEventData;
import SessionStateEventData = cast.framework.SessionStateEventData;

import ChromecastOutput from '../playback-engine/output/chromecast/chromecast-output';
import { IEventEmitter } from '../event-emitter/types';

import injectScript from '../../utils/script-injector';

type PatchedWindow = Window & {
  __onGCastApiAvailable: Function;
};

const FRAMEWORK_LINK =
  'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';

export enum ChromecastEvents {
  CHROMECAST_INITED = 'ui-events/chromecast-inited',
  CHROMECAST_CASTS_STARTED = 'ui-events/chromecast-started',
  CHROMECAST_CASTS_RESUMED = 'ui-events/chromecast-resumed',
  CHROMECAST_CASTS_STOPED = 'ui-events/chromecast-stoped',
  CHROMECAST_NOT_CONNECTED = 'ui-events/chromecast-not-connected',
  CHROMECAST_CONNECTING = 'ui-events/chromecast-connecting',
  CHROMECAST_CONNECTED = 'ui-events/chromecast-connected',
  CHROMECAST_NO_DEVICES_AVAILABLE = 'ui-events/chromecast-not-available',
}

export default class ChromecastManager implements IChromecastManager {
  static moduleName = 'chromecastManager';
  static dependencies = ['eventEmitter', 'engine', 'rootContainer'];

  private _engine: IPlaybackEngine;
  private _context: CastContext;
  private _eventEmitter: IEventEmitter;

  constructor({
    engine,
    eventEmitter,
  }: {
    engine: IPlaybackEngine;
    eventEmitter: IEventEmitter;
  }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;

    this._initCastContext = this._initCastContext.bind(this);
    this._onCastStateChange = this._onCastStateChange.bind(this);
    this._onSessionStateChange = this._onSessionStateChange.bind(this);

    this._insertCastCallback();
  }

  private _insertCastCallback() {
    if (ChromecastManager._chromecastInited) {
      return;
    }

    ChromecastManager._chromecastInited = true;

    (window as PatchedWindow).__onGCastApiAvailable = this._initCastContext;

    injectScript(FRAMEWORK_LINK);
  }

  private _initCastContext(isAvailable: boolean) {
    if (isAvailable && ChromecastManager._isCastApiInited) {
      const cast = window.cast;
      const chrome = window.chrome;

      this._context = cast.framework.CastContext.getInstance();

      this._context.setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      });

      this._bindToContextEvents();
      this._eventEmitter.emitAsync(ChromecastEvents.CHROMECAST_INITED);
    }
  }

  private static get _isCastApiInited() {
    const cast = window.cast;
    const chrome = window.chrome;
    return Boolean(cast && cast.framework && chrome && chrome.cast);
  }

  /*
   * Set to true when the first instance if the player initializes chromecast
   * Only first player will receive chromecast button
   * */
  private static _chromecastInited: boolean;

  private _onCastStateChange(event: CastStateEventData) {
    switch (event.castState) {
      case cast.framework.CastState.NOT_CONNECTED:
        this._eventEmitter.emitAsync(ChromecastEvents.CHROMECAST_NOT_CONNECTED);
        break;
      case cast.framework.CastState.CONNECTING:
        this._eventEmitter.emitAsync(ChromecastEvents.CHROMECAST_CONNECTING);
        break;
      case cast.framework.CastState.CONNECTED:
        this._eventEmitter.emitAsync(ChromecastEvents.CHROMECAST_CONNECTED);
        break;
      case cast.framework.CastState.NO_DEVICES_AVAILABLE:
        this._eventEmitter.emitAsync(
          ChromecastEvents.CHROMECAST_NO_DEVICES_AVAILABLE,
        );
        break;
      default:
        break;
    }
  }

  private _onSessionStateChange(event: SessionStateEventData) {
    const context = this._context;
    const engine = this._engine;
    const eventEmitter = this._eventEmitter;
    let startTime: number;

    switch (event.sessionState) {
      case cast.framework.SessionState.SESSION_STARTED:
        startTime = engine.getCurrentTime();

        engine.changeOutput(new ChromecastOutput(eventEmitter), () => {
          engine.seekTo(startTime);
          eventEmitter.emitAsync(ChromecastEvents.CHROMECAST_CASTS_RESUMED);
        });
        break;
      case cast.framework.SessionState.SESSION_RESUMED: // start cast to chromecast -> reload page -> SESSION_RESUMED
        startTime = context
          .getCurrentSession()
          .getMediaSession()
          .getEstimatedTime();

        engine.changeOutput(new ChromecastOutput(eventEmitter), () => {
          engine.seekTo(startTime);
          eventEmitter.emitAsync(ChromecastEvents.CHROMECAST_CASTS_RESUMED);
        });
        break;
      case cast.framework.SessionState.SESSION_ENDED:
        engine.resetOutput();
        eventEmitter.emitAsync(ChromecastEvents.CHROMECAST_CASTS_STOPED);
        break;
      default:
        break;
    }
  }

  private _bindToContextEvents() {
    const context = this._context;

    context.addEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      this._onCastStateChange,
    );

    context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      this._onSessionStateChange,
    );
  }

  destroy() {
    const context = this._context;

    context.removeEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      this._onCastStateChange,
    );

    context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      this._onSessionStateChange,
    );
  }

  isCasting: boolean;
  isEnabled: boolean;
}
