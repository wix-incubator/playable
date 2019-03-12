import { IChromecastManager } from './types';
import { IPlaybackEngine } from '../playback-engine/types';
import CastContext = cast.framework.CastContext;
import ChromecastOutput from '../playback-engine/output/chromecast/chromecast-output';
import { IEventEmitter } from '../event-emitter/types';
import { UIEvent } from '../../constants';

import injectScript from '../../utils/script-injector';

type PatchedWindow = Window & {
  __onGCastApiAvailable: Function;
};

const FRAMEWORK_LINK =
  'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';

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

    this._insertCastCallback();
  }

  _insertCastCallback() {
    if (ChromecastManager._chromecastInited) {
      return;
    }

    ChromecastManager._chromecastInited = true;

    (window as PatchedWindow).__onGCastApiAvailable = this._initCastContext;

    injectScript(FRAMEWORK_LINK);
  }

  _initCastContext(isAvailable: boolean) {
    if (isAvailable) {
      this._context = cast.framework.CastContext.getInstance();

      this._context.setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      });

      this._bindToContextEvents();
      this._eventEmitter.emitAsync(UIEvent.CHROMECAST_INITED);
    }
  }

  /*
   * Set to true when the first instance if the player initializes chromecast
   * Only first player will receive chromecast button
   * */
  private static _chromecastInited: boolean;

  private _bindToContextEvents() {
    const context = this._context;
    const engine = this._engine;
    const eventEmitter = this._eventEmitter;

    context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      function(event) {
        switch (event.sessionState) {
          case cast.framework.SessionState.SESSION_STARTED:
          case cast.framework.SessionState.SESSION_RESUMED: // start cast to chromecast -> reload page -> SESSION_RESUMED
            engine.changeOutput(new ChromecastOutput(eventEmitter));
            break;
          case cast.framework.SessionState.SESSION_ENDED:
            engine.resetOutput();
            break;
          default:
            break;
        }
      },
    );
  }

  destroy: () => void;

  isCasting: boolean;
  isEnabled: boolean;
}
