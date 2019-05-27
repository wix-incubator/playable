import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import createPlayerTestkit from '../../../testkit';

import { VideoEvent, UIEvent, EngineState } from '../../../constants';

describe('Overlay', () => {
  let testkit: any;
  let overlay: any = {};
  let eventEmitter: any = {};
  let eventEmitterSpy: any = null;

  // let mainUIBlock: any;
  // let disableShowingContentSpy: any;
  // let enableShowingContentSpy: any;
  //
  // let loader: any;
  // let loaderShowSpy: any;
  // let loaderHideSpy: any;

  beforeEach(() => {
    testkit = createPlayerTestkit();
  });

  describe('constructor', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
    });

    it('should create instance ', () => {
      expect(overlay).to.exist;
      expect(overlay.view).to.exist;
    });
  });

  // describe(`check Loader's and MainUIBlock's API usage`, () => {
  //   beforeEach(() => {
  //     overlay = testkit.getModule('overlay');
  //
  //     mainUIBlock = testkit.getModule('mainUIBlock');
  //     enableShowingContentSpy = sinon.spy(mainUIBlock, 'enableShowingContent');
  //
  //     loader = testkit.getModule('loader');
  //     loaderShowSpy = sinon.spy(loader, 'show');
  //
  //     eventEmitter = testkit.getModule('eventEmitter');
  //   });
  //
  //   it(`if Overlay's "_hideContent" method invokes external API`, async () => {
  //     await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, { nextState: EngineState.PLAY_REQUESTED});
  //     expect(loaderShowSpy.called).to.be.true;
  //     expect(enableShowingContentSpy.called).to.be.true;
  //   })
  // });

  // describe(`check Loader's and MainUIBlock's API usage v2`, () => {
  //   beforeEach(() => {
  //     overlay = testkit.getModule('overlay');
  //
  //     mainUIBlock = testkit.getModule('mainUIBlock');
  //     disableShowingContentSpy = sinon.spy(mainUIBlock, 'disableShowingContent');
  //
  //     loader = testkit.getModule('loader');
  //     loaderHideSpy = sinon.spy(loader, 'hide');
  //
  //     eventEmitter = testkit.getModule('eventEmitter');
  //   });
  //
  //   it(`if Overlay's "_showContent" method invokes external API`, async () => {
  //     await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, { nextState: EngineState.SRC_SET});
  //     expect(loaderHideSpy.called).to.be.true;
  //     expect(disableShowingContentSpy.called).to.be.true;
  //   })
  // });

  describe('instance callbacks to controls', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
      eventEmitter = testkit.getModule('eventEmitter');

      eventEmitterSpy = sinon.spy(eventEmitter, 'emitAsync');
    });

    afterEach(() => {
      eventEmitter.emitAsync.restore();
    });

    it('should emit ui event on play', () => {
      const callback = sinon.stub(overlay._engine, 'play');

      overlay._playVideo();

      expect(callback.called).to.be.true;
      expect(eventEmitterSpy.calledWith(UIEvent.PLAY_OVERLAY_CLICK)).to.be.true;

      overlay._engine.play.restore();
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      overlay = testkit.getModule('overlay');
      eventEmitter = testkit.getModule('eventEmitter');
    });

    it('should react on video playback state changed on play', async function() {
      const callback = sinon.spy(overlay, '_updatePlayingState');
      const hideSpy = sinon.spy(overlay, '_hideContent');

      overlay._bindEvents();

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.PLAY_REQUESTED,
      });

      expect(callback.called).to.be.true;
      expect(hideSpy.called).to.be.true;
    });

    it('should react on video playback state changed on end', async function() {
      const callback = sinon.spy(overlay, '_updatePlayingState');
      const showSpy = sinon.spy(overlay, '_showContent');
      overlay._bindEvents();

      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {
        nextState: EngineState.ENDED,
      });

      expect(callback.called).to.be.true;
      expect(showSpy.called).to.be.true;
    });
  });
});
