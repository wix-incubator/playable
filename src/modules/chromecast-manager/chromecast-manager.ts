import { IChromecastManager } from './types';
import { IPlayableSource, IPlaybackEngine } from '../playback-engine/types';
import CastContext = cast.framework.CastContext;
import ChromecastOutput from '../playback-engine/output/chromecast/chromecast-output';
import { IEventEmitter } from '../event-emitter/types';
import { getMimeByType } from '../../utils/get-mime-type';

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

    this._initCastFramework = this._initCastFramework.bind(this);

    this._insertCastCallback();
  }

  _insertCastCallback() {
    (window as PatchedWindow).__onGCastApiAvailable = this._initCastFramework;

    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = FRAMEWORK_LINK;
    head.appendChild(script);
  }

  _initCastFramework(isAvailable: boolean) {
    if (isAvailable && cast.framework && chrome.cast) {
      this._context = cast.framework.CastContext.getInstance();

      this._context.setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      });

      this._bindToContextEvents();
    }
  }

  private _bindToContextEvents() {
    const context = this._context;
    const engine = this._engine;
    const eventEmitter = this._eventEmitter;

    context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      function(event) {
        switch (event.sessionState) {
          case cast.framework.SessionState.SESSION_STARTED:
            const { url, type } = engine.getSrc() as IPlayableSource;
            const startTime = engine.getCurrentTime();
            const mediaInfo = new chrome.cast.media.MediaInfo(
              url,
              getMimeByType(type),
            );

            const castSession = context.getCurrentSession();
            const request = new chrome.cast.media.LoadRequest(mediaInfo);

            request.autoplay = false;

            if (startTime) {
              request.currentTime = startTime;
            }

            engine.pause();

            castSession.loadMedia(request).then(() => {
              engine.changeOutput(new ChromecastOutput(eventEmitter));
            });

            break;
          case cast.framework.SessionState.SESSION_RESUMED:
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

  destroy() {
    this._engine = null;
  }

  isCasting: boolean;
  isEnabled: boolean;
}
