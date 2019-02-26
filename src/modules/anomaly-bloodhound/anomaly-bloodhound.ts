import { VIDEO_EVENTS, EngineState } from '../../constants';

import { IEventEmitter } from '../event-emitter/types';
import { IPlaybackEngine } from '../playback-engine/types';

import {
  IReportReasons,
  ITimeoutMap,
  IReportTypes,
  IReportType,
} from './types';
import playerAPI from '../../core/player-api-decorator';

export const REPORT_REASONS: IReportReasons = {
  LONG_INITIAL_VIDEO_PARTS_LOADING: 'long-initial-video-parts-loading',
  LONG_METADATA_LOADING: 'long-metadata-loading',
  LONG_SEEK_PROCESSING: 'long-seek-processing',
  BUFFER_EMPTY_FOR_CURRENT_SEGMENT: 'buffer-empty-for-current-segment',
  LONG_PLAY_REQUESTED_PROCESSING: 'long-play-requested-processing',
};

export const DELAYED_REPORT_TYPES: IReportTypes = {
  INITIAL_VIDEO_PARTS_LOADING: {
    id: '_initialVideoPartsLoading',
    timeoutTime: 5000,
  },
  METADATA_LOADING: {
    id: '_metadataLoading',
    timeoutTime: 5000,
  },
  RUNTIME_LOADING: {
    id: '_runtimeLoading',
    timeoutTime: 5000,
  },
};

export default class AnomalyBloodhound {
  static moduleName = 'anomalyBloodhound';
  static dependencies = ['eventEmitter', 'engine'];

  private _engine: IPlaybackEngine;
  private _eventEmitter: IEventEmitter;
  private _timeoutMap: ITimeoutMap;

  private _unbindEvents: () => void;

  private _callback: (anomalyData: any) => void;

  constructor({
    engine,
    eventEmitter,
  }: {
    engine: IPlaybackEngine;
    eventEmitter: IEventEmitter;
  }) {
    this._engine = engine;
    this._eventEmitter = eventEmitter;

    this._timeoutMap = Object.create(null);

    this._bindEvents();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [[VIDEO_EVENTS.STATE_CHANGED, this._processStateChange]],
      this,
    );
  }

  private _processStateChange({
    prevState,
    nextState,
  }: {
    prevState: EngineState;
    nextState: EngineState;
  }) {
    switch (nextState) {
      case EngineState.LOAD_STARTED:
        if (
          this._engine.isAutoPlayAvailable ||
          this._engine.isPreloadAvailable
        ) {
          this.startDelayedReport(
            DELAYED_REPORT_TYPES.METADATA_LOADING,
            REPORT_REASONS.LONG_METADATA_LOADING,
          );
        }
        break;

      case EngineState.METADATA_LOADED:
        if (this.isDelayedReportExist(DELAYED_REPORT_TYPES.METADATA_LOADING)) {
          this.stopDelayedReport(DELAYED_REPORT_TYPES.METADATA_LOADING);

          if (this._engine.getPreload() !== 'metadata') {
            this.startDelayedReport(
              DELAYED_REPORT_TYPES.INITIAL_VIDEO_PARTS_LOADING,
              REPORT_REASONS.LONG_INITIAL_VIDEO_PARTS_LOADING,
            );
          }
        }
        break;

      case EngineState.READY_TO_PLAY:
        if (
          this.isDelayedReportExist(
            DELAYED_REPORT_TYPES.INITIAL_VIDEO_PARTS_LOADING,
          )
        ) {
          this.stopDelayedReport(
            DELAYED_REPORT_TYPES.INITIAL_VIDEO_PARTS_LOADING,
          );
        }
        if (this.isDelayedReportExist(DELAYED_REPORT_TYPES.RUNTIME_LOADING)) {
          this.stopDelayedReport(DELAYED_REPORT_TYPES.RUNTIME_LOADING);
        }
        break;

      case EngineState.SEEK_IN_PROGRESS:
        if (prevState === EngineState.PAUSED) {
          this.startDelayedReport(
            DELAYED_REPORT_TYPES.RUNTIME_LOADING,
            REPORT_REASONS.LONG_SEEK_PROCESSING,
          );
        }
        break;

      case EngineState.WAITING:
        switch (prevState) {
          case EngineState.PLAYING: {
            this.reportDebugInfo({
              reason: REPORT_REASONS.BUFFER_EMPTY_FOR_CURRENT_SEGMENT,
            });

            break;
          }

          case EngineState.PLAY_REQUESTED:
            if (
              !this.isDelayedReportExist(DELAYED_REPORT_TYPES.RUNTIME_LOADING)
            ) {
              this.startDelayedReport(
                DELAYED_REPORT_TYPES.RUNTIME_LOADING,
                REPORT_REASONS.LONG_PLAY_REQUESTED_PROCESSING,
              );
            }
            break;

          /* ignore coverage */
          default:
            break;
        }
        break;

      case EngineState.PLAYING:
        if (this.isDelayedReportExist(DELAYED_REPORT_TYPES.RUNTIME_LOADING)) {
          this.stopDelayedReport(DELAYED_REPORT_TYPES.RUNTIME_LOADING);
        }
        break;
      default:
        break;
    }
  }

  isDelayedReportExist(type: IReportType) {
    return Boolean(this._timeoutMap[type.id]);
  }

  startDelayedReport(type: IReportType, reason: string) {
    if (this.isDelayedReportExist(type)) {
      this.stopDelayedReport(type);
    }

    const startTS = Date.now();
    this._timeoutMap[type.id] = window.setTimeout(() => {
      const endTS = Date.now();
      delete this._timeoutMap;
      this.reportDebugInfo({
        reason,
        startTS,
        endTS,
      });
    }, type.timeoutTime);
  }

  stopDelayedReport(type: IReportType) {
    window.clearTimeout(this._timeoutMap[type.id]);
    delete this._timeoutMap[type.id];
  }

  stopAllDelayedReports() {
    Object.keys(this._timeoutMap).forEach(key => {
      window.clearTimeout(this._timeoutMap[key]);
      delete this._timeoutMap[key];
    });
  }

  @playerAPI()
  setAnomalyCallback(callback: (anomalyData: any) => void) {
    if (callback) {
      this._callback = callback;
    }
  }

  reportDebugInfo({
    reason,
    startTS,
    endTS,
  }: {
    reason: string;
    startTS?: number;
    endTS?: number;
  }) {
    this._callback &&
      this._callback({
        reason,
        startTS,
        endTS,
        ...this._engine.getDebugInfo(),
      });
  }

  destroy() {
    this.stopAllDelayedReports();

    this._unbindEvents();
  }
}
