import 'jsdom-global/register';

import { expect } from 'chai';

import * as sinon from 'sinon';

import createPlayerTestkit from '../../testkit';

import AnomalyBloodhound, { DELAYED_REPORT_TYPES } from './anomaly-bloodhound';

import { VideoEvent, EngineState } from '../../constants';

describe('AnomalyBloodhound', () => {
  let testkit: any;
  let anomalyBloodhound: any;
  let eventEmitter: any;
  let engine: any;
  const callback = sinon.spy();

  beforeEach(() => {
    testkit = createPlayerTestkit();
    eventEmitter = testkit.getModule('eventEmitter');
    engine = testkit.getModule('engine');
    testkit.registerModule(AnomalyBloodhound.moduleName, AnomalyBloodhound);
    anomalyBloodhound = testkit.getModule('anomalyBloodhound');
    anomalyBloodhound.setAnomalyCallback(callback);
  });

  afterEach(() => {
    callback.resetHistory();
  });

  describe('reaction on changed state', () => {
    it('should be based on event', async function() {
      const spy = sinon.spy(anomalyBloodhound, '_processStateChange');
      anomalyBloodhound._bindEvents();
      await eventEmitter.emitAsync(VideoEvent.STATE_CHANGED, {});
      expect(spy.called).to.be.true;
      anomalyBloodhound._processStateChange.restore();
    });

    describe('for LOAD_STARTED', () => {
      it('should not schedule report if preload is not available and autoPlay is false', () => {
        engine.setPreload('none');
        engine.setAutoplay(false);
        anomalyBloodhound._processStateChange({
          nextState: EngineState.LOAD_STARTED,
        });

        expect(
          anomalyBloodhound.isDelayedReportExist(
            DELAYED_REPORT_TYPES.METADATA_LOADING,
          ),
        ).to.be.false;
      });

      it('should not schedule report if preload is autoPlay is true', () => {
        engine.setAutoplay(true);
        anomalyBloodhound._processStateChange({
          nextState: EngineState.LOAD_STARTED,
        });

        expect(
          anomalyBloodhound.isDelayedReportExist(
            DELAYED_REPORT_TYPES.METADATA_LOADING,
          ),
        ).to.be.true;
      });

      it('should schedule report if preload available as metadata', () => {
        engine.setPreload('metadata');
        anomalyBloodhound._processStateChange({
          nextState: EngineState.LOAD_STARTED,
        });

        expect(
          anomalyBloodhound.isDelayedReportExist(
            DELAYED_REPORT_TYPES.METADATA_LOADING,
          ),
        ).to.be.true;
      });

      it('should schedule report if preload available as auto', () => {
        engine.setPreload('metadata');
        anomalyBloodhound._processStateChange({
          nextState: EngineState.LOAD_STARTED,
        });

        expect(
          anomalyBloodhound.isDelayedReportExist(
            DELAYED_REPORT_TYPES.METADATA_LOADING,
          ),
        ).to.be.true;
      });
    });

    it('should start delayed report on METADATA_LOADED', () => {
      anomalyBloodhound._processStateChange({
        nextState: EngineState.LOAD_STARTED,
      });

      anomalyBloodhound._processStateChange({
        nextState: EngineState.METADATA_LOADED,
      });

      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.METADATA_LOADING,
        ),
      ).to.be.false;
      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.INITIAL_VIDEO_PARTS_LOADING,
        ),
      ).to.be.true;

      anomalyBloodhound.stopAllDelayedReports();
      engine.setPreload('metadata');

      anomalyBloodhound._processStateChange({
        nextState: EngineState.METADATA_LOADED,
      });
      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.INITIAL_VIDEO_PARTS_LOADING,
        ),
      ).to.be.false;
    });

    it('should start delayed report on SEEK_IN_PROGRESS', () => {
      anomalyBloodhound._processStateChange({
        nextState: EngineState.SEEK_IN_PROGRESS,
        prevState: EngineState.PAUSED,
      });

      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.RUNTIME_LOADING,
        ),
      ).to.be.true;
    });

    it('should clear delayed report on READY_TO_PLAY', () => {
      anomalyBloodhound.startDelayedReport(
        DELAYED_REPORT_TYPES.INITIAL_VIDEO_PARTS_LOADING,
      );
      anomalyBloodhound._processStateChange({
        nextState: EngineState.READY_TO_PLAY,
      });
      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.INITIAL_VIDEO_PARTS_LOADING,
        ),
      ).to.be.false;

      anomalyBloodhound.startDelayedReport(
        DELAYED_REPORT_TYPES.RUNTIME_LOADING,
      );
      anomalyBloodhound._processStateChange({
        nextState: EngineState.READY_TO_PLAY,
      });
      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.RUNTIME_LOADING,
        ),
      ).to.be.false;
    });

    it('should clear delayed report on PLAYING', () => {
      anomalyBloodhound.startDelayedReport(
        DELAYED_REPORT_TYPES.RUNTIME_LOADING,
      );
      anomalyBloodhound._processStateChange({
        nextState: EngineState.PLAYING,
      });
      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.RUNTIME_LOADING,
        ),
      ).to.be.false;
    });

    it('should start delayed report on WAITING', () => {
      anomalyBloodhound._processStateChange({
        nextState: EngineState.WAITING,
        prevState: EngineState.PLAY_REQUESTED,
      });

      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.RUNTIME_LOADING,
        ),
      ).to.be.true;
      anomalyBloodhound.stopAllDelayedReports();

      anomalyBloodhound._processStateChange({
        nextState: EngineState.WAITING,
        prevState: EngineState.PLAYING,
      });

      expect(callback.called).to.be.true;
    });

    (it as any)(
      'delayed report should be resolved',
      (done: any) => {
        (DELAYED_REPORT_TYPES as any).___test = {
          id: '___test',
          timeout: 5,
        };

        window.setTimeout(() => {
          expect(callback.calledOnce).to.be.true;
          done();
        }, 10);

        anomalyBloodhound.startDelayedReport(
          (DELAYED_REPORT_TYPES as any).___test,
        );
        anomalyBloodhound.startDelayedReport(
          (DELAYED_REPORT_TYPES as any).___test,
        );
      },
      100,
    );
  });
});
