import createPlayerTestkit from '../../testkit';

import ChromecastManager, { ChromecastEvents } from './chromecast-manager';
import {
  WindowCastAPIMock,
  WindowChromeAPIMock,
  eventType,
  SessionState,
} from '../../testkit/chomecast-api-mock';

describe('ChromecastManager', () => {
  let testkit: any;
  let chromecastManager: any;
  let eventEmitter: any;
  let engine: any;
  let castApi: WindowCastAPIMock;

  const video = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    removeAttribute: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    currentTime: 0,
    tagName: 'VIDEO',
  };

  const config = {
    videoElement: video,
  };

  beforeEach(() => {
    // @ts-ignore
    window.cast = castApi = new WindowCastAPIMock();
    // @ts-ignore
    window.chrome = new WindowChromeAPIMock();

    testkit = createPlayerTestkit(config);
    eventEmitter = testkit.getModule('eventEmitter');
    engine = testkit.getModule('engine');
    testkit.registerModule(ChromecastManager.moduleName, ChromecastManager);

    chromecastManager = testkit.getModule('chromecastManager');
  });

  afterEach(() => {
    WindowCastAPIMock.reset();

    ChromecastManager._chromecastInited = false;
  });

  describe('Initalized ', () => {
    it('only if casting API is available', () => {
      const context = castApi.framework.CastContext.getInstance();
      const stab = vi.spyOn(context, 'setOptions');

      chromecastManager._initCastContext(false);
      expect(stab).not.toHaveBeenCalled();

      stab.mockClear();
      WindowCastAPIMock.init();
    });
  });

  describe('After init', () => {
    it('adds sсript for chromecast API', () => {
      return new Promise<void>(resolve => {
        eventEmitter.on(ChromecastEvents.CHROMECAST_INITED, () => {
          expect(document.scripts[0].src).toBe(
            'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1',
          );
          resolve();
        });
        WindowCastAPIMock.init();
      });
    });

    it('sets static _chromecastInited field to true', () => {
      return new Promise<void>(resolve => {
        eventEmitter.on(ChromecastEvents.CHROMECAST_INITED, () => {
          expect(ChromecastManager._chromecastInited).toBe(true);
          resolve();
        });
        WindowCastAPIMock.init();
      });
    });
  });

  describe('should subscribe on chromecast API events', () => {
    describe('on start casting ', () => {
      const event = {
        sessionState: SessionState.SESSION_STARTED,
      };

      it('changes output to chromecast', () => {
        return new Promise<void>(resolve => {
          eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => {
            expect(engine._output.getDebugInfo().output).toBe('chromecast');
            resolve();
          });
          WindowCastAPIMock.init();
          castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, event);
        });
      });

      it('gets starting time from video tag', () => {
        video.currentTime = 200;
        return new Promise<void>(resolve => {
          eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => {
            expect(engine._output.currentTime).toBe(200);
            video.currentTime = 0;
            resolve();
          });
          WindowCastAPIMock.init();
          castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, event);
        });
      });
    });

    describe('on resume casting changes output to chromecast', () => {
      const event = {
        sessionState: SessionState.SESSION_RESUMED,
      };

      it('changes output to chromecast', () => {
        return new Promise<void>(resolve => {
          eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_RESUMED, () => {
            expect(engine._output.getDebugInfo().output).toBe('chromecast');
            resolve();
          });
          WindowCastAPIMock.init();
          castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, event);
        });
      });

      it('gets starting time from chromecast session', () => {
        castApi.framework.context._estimatedTime = 500;
        return new Promise<void>(resolve => {
          eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_RESUMED, () => {
            expect(engine._output.currentTime).toBe(500);
            video.currentTime = 0;
            resolve();
          });
          WindowCastAPIMock.init();
          castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, event);
        });
      });
    });

    describe('on stop casting changes output to html5video', () => {
      const endEvent = {
        sessionState: SessionState.SESSION_ENDED,
      };

      const startEvent = {
        sessionState: SessionState.SESSION_STARTED,
      };

      it('changes output to native', () => {
        return new Promise<void>(resolve => {
          eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STOPED, () => {
            expect(engine._output.getDebugInfo().output).toBe('html5video');
            resolve();
          });
          eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => {
            castApi.framework.trigger(
              eventType.SESSION_STATE_CHANGED,
              endEvent,
            );
          });
          WindowCastAPIMock.init();
          castApi.framework.trigger(
            eventType.SESSION_STATE_CHANGED,
            startEvent,
          );
        });
      });

      it('gets starting time from chromecast output', () => {
        let player: any;
        return new Promise<void>(resolve => {
          eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STOPED, () => {
            expect(engine._output.currentTime).toBe(1000);
            player.currentTime = 0;
            resolve();
          });
          eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => {
            player = engine._output._player;
            player.currentTime = 1000;
            castApi.framework.trigger(
              eventType.SESSION_STATE_CHANGED,
              endEvent,
            );
          });
          WindowCastAPIMock.init();
          castApi.framework.trigger(
            eventType.SESSION_STATE_CHANGED,
            startEvent,
          );
        });
      });
    });
  });
});
