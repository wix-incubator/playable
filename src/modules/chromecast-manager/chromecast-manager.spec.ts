import 'jsdom-global/register';
import { expect } from 'chai';

import * as sinon from 'sinon';

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
    addEventListener: sinon.spy(),
    removeEventListener: sinon.spy(),
    removeAttribute: sinon.spy(),
    play: sinon.spy(),
    pause: sinon.spy(),
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
      const stab = sinon.stub(context, 'setOptions');

      chromecastManager._initCastContext(false);
      expect(stab.called).to.equal(false);

      stab.reset();
      WindowCastAPIMock.init();
    });
  });

  describe('After init', () => {
    it('adds sсript for chromecast API', done => {
      eventEmitter.on(ChromecastEvents.CHROMECAST_INITED, () => {
        expect(document.scripts[0].src).to.equal(
          'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1',
        );

        done();
      });

      WindowCastAPIMock.init();
    });

    it('sets static _chromecastInited field to true', done => {
      eventEmitter.on(ChromecastEvents.CHROMECAST_INITED, () => {
        expect(ChromecastManager._chromecastInited).to.equal(true);

        done();
      });

      WindowCastAPIMock.init();
    });
  });

  describe('should subscribe on chromecast API events', () => {
    describe('on start casting ', () => {
      const event = {
        sessionState: SessionState.SESSION_STARTED,
      };

      it('changes output to chromecast', done => {
        eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => {
          expect(engine._output.getDebugInfo().output).equal('chromecast');
          done();
        });

        WindowCastAPIMock.init();

        castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, event);
      });

      it('gets starting time from video tag', done => {
        video.currentTime = 200;

        eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => {
          expect(engine._output.currentTime).equal(200);
          video.currentTime = 0;
          done();
        });

        WindowCastAPIMock.init();
        castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, event);
      });
    });

    describe('on resume casting changes output to chromecast', () => {
      const event = {
        sessionState: SessionState.SESSION_RESUMED,
      };

      it('changes output to chromecast', done => {
        eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_RESUMED, () => {
          expect(engine._output.getDebugInfo().output).equal('chromecast');
          done();
        });

        WindowCastAPIMock.init();

        castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, event);
      });

      it('gets starting time from chromecast session', done => {
        castApi.framework.context._estimatedTime = 500;

        eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_RESUMED, () => {
          expect(engine._output.currentTime).equal(500);
          video.currentTime = 0;
          done();
        });

        WindowCastAPIMock.init();
        castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, event);
      });
    });

    describe('on stop casting changes output to html5video', () => {
      const endEvent = {
        sessionState: SessionState.SESSION_ENDED,
      };

      const startEvent = {
        sessionState: SessionState.SESSION_STARTED,
      };

      it('changes output to native', done => {
        eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STOPED, () => {
          expect(engine._output.getDebugInfo().output).equal('html5video');
          done();
        });

        eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => {
          castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, endEvent);
        });

        WindowCastAPIMock.init();
        castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, startEvent);
      });

      it('gets starting time from chromecast output', done => {
        let player: any;

        eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STOPED, () => {
          expect(engine._output.currentTime).equal(1000);
          player.currentTime = 0;
          done();
        });

        eventEmitter.on(ChromecastEvents.CHROMECAST_CASTS_STARTED, () => {
          player = engine._output._player;
          player.currentTime = 1000;
          castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, endEvent);
        });

        WindowCastAPIMock.init();
        castApi.framework.trigger(eventType.SESSION_STATE_CHANGED, startEvent);
      });
    });
  });
});
