import 'jsdom-global/register';

import { expect } from 'chai';
import * as sinon from 'sinon';

import AnomalyBloodhound, { DELAYED_REPORT_TYPES } from './anomaly-bloodhound';
import Engine from '../playback-engine/playback-engine';
import EventEmitter from '../event-emitter/event-emitter';

import { VIDEO_EVENTS, STATES } from '../../constants/index';

describe('AnomalyBloodhound', () => {
  let anomalyBloodhound;
  let eventEmitter;
  let engine;
  let states;
  const callback = sinon.spy();
  const config = {
    anomalyBloodhound: {
      callback,
    },
  };

  beforeEach(() => {
    eventEmitter = new EventEmitter();
    engine = new Engine({
      config,
      eventEmitter,
    });
    states = STATES;
    anomalyBloodhound = new AnomalyBloodhound({
      eventEmitter,
      engine,
      config,
    });
  });

  afterEach(() => {
    callback.reset();
  });

  describe('reaction on changed state', () => {
    it('should be based on event', () => {
      const spy = sinon.spy(anomalyBloodhound, '_processStateChange');
      anomalyBloodhound._bindEvents();
      eventEmitter.emit(VIDEO_EVENTS.STATE_CHANGED);
      expect(spy.called).to.be.true;
      anomalyBloodhound._processStateChange.restore();
    });

    describe('for LOAD_STARTED', () => {
      it('should not schedule report if preload is not available and autoPlay is false', () => {
        engine.setPreload('none');
        engine.setAutoPlay(false);
        anomalyBloodhound._processStateChange({
          nextState: states.LOAD_STARTED,
        });

        expect(
          anomalyBloodhound.isDelayedReportExist(
            DELAYED_REPORT_TYPES.METADATA_LOADING,
          ),
        ).to.be.false;
      });

      it('should not schedule report if preload is autoPlay is true', () => {
        engine.setAutoPlay(true);
        anomalyBloodhound._processStateChange({
          nextState: states.LOAD_STARTED,
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
          nextState: states.LOAD_STARTED,
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
          nextState: states.LOAD_STARTED,
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
        nextState: states.LOAD_STARTED,
      });

      anomalyBloodhound._processStateChange({
        nextState: states.METADATA_LOADED,
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
        nextState: states.METADATA_LOADED,
      });
      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.INITIAL_VIDEO_PARTS_LOADING,
        ),
      ).to.be.false;
    });

    it('should start delayed report on SEEK_IN_PROGRESS', () => {
      anomalyBloodhound._processStateChange({
        nextState: states.SEEK_IN_PROGRESS,
        prevState: states.PAUSED,
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
        nextState: states.READY_TO_PLAY,
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
        nextState: states.READY_TO_PLAY,
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
        nextState: states.PLAYING,
      });
      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.RUNTIME_LOADING,
        ),
      ).to.be.false;
    });

    it('should start delayed report on WAITING', () => {
      anomalyBloodhound._processStateChange({
        nextState: states.WAITING,
        prevState: states.PLAY_REQUESTED,
      });

      expect(
        anomalyBloodhound.isDelayedReportExist(
          DELAYED_REPORT_TYPES.RUNTIME_LOADING,
        ),
      ).to.be.true;
      anomalyBloodhound.stopAllDelayedReports();

      anomalyBloodhound._processStateChange({
        nextState: states.WAITING,
        prevState: states.PLAYING,
      });

      expect(callback.called).to.be.true;
    });

    (it as any)(
      'delayed report should be resolved',
      done => {
        DELAYED_REPORT_TYPES['___test'] = {
          id: '___test',
          timeout: 5,
        };

        setTimeout(() => {
          expect(callback.calledOnce).to.be.true;
          done();
        }, 10);

        anomalyBloodhound.startDelayedReport(DELAYED_REPORT_TYPES['___test']);
        anomalyBloodhound.startDelayedReport(DELAYED_REPORT_TYPES['___test']);
      },
      100,
    );
  });
});
