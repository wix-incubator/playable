import View from './progress.view';

import {
  getTimePercent,
  getOverallBufferedPercent,
  getOverallPlayedPercent,
} from '../../../../utils/video-data';

import {
  VIDEO_EVENTS,
  UI_EVENTS,
  EngineState,
  LiveState,
} from '../../../../constants';
import { AMOUNT_TO_SKIP_SECONDS } from '../../../keyboard-control/keyboard-control';

import KeyboardInterceptor, {
  KEYCODES,
} from '../../../../utils/keyboard-interceptor';
import formatTime from '../../core/utils/formatTime';

import playerAPI from '../../../../core/player-api-decorator';

import { IEventEmitter } from '../../../event-emitter/types';
import { ITooltipService } from '../../core/tooltip/types';
import { IProgressControl, IProgressViewConfig } from './types';
import { ITextMap } from '../../../text-map/types';
import { IPlaybackEngine } from '../../../playback-engine/types';
import { IPreviewThumbnail } from '../../preview-thumbnail/types';
import { IPreviewFullSize } from '../../preview-full-size/types';

import { IThemeService } from '../../core/theme';

const UPDATE_INTERVAL_DELAY = 1000 / 60;

export default class ProgressControl implements IProgressControl {
  static moduleName = 'progressControl';
  static View = View;
  static dependencies = [
    'engine',
    'liveStateEngine',
    'eventEmitter',
    'textMap',
    'tooltipService',
    'theme',
    'previewThumbnail',
    'previewFullSize',
  ];

  private _engine: IPlaybackEngine;
  private _liveStateEngine: any;
  private _eventEmitter: IEventEmitter;
  private _textMap: ITextMap;
  private _tooltipService: ITooltipService;
  private _theme: IThemeService;
  private _previewThumbnail: IPreviewThumbnail;
  private _previewFullSize: IPreviewFullSize;

  private _isUserDragging: boolean;
  private _shouldPlayAfterDragEnd: boolean;
  private _desiredSeekPosition: number;
  private _interceptor: KeyboardInterceptor;
  private _updateControlInterval: number;
  private _timeIndicatorsToAdd: number[];

  private _shouldHidePreviewOnUpdate: boolean;

  private _showFullScreenPreview: boolean;

  private _unbindEvents: () => void;

  view: View;
  isHidden: boolean;

  constructor({
    engine,
    liveStateEngine,
    eventEmitter,
    textMap,
    tooltipService,
    theme,
    previewThumbnail,
    previewFullSize,
  }: {
    eventEmitter: IEventEmitter;
    engine: IPlaybackEngine;
    liveStateEngine: any;
    textMap: ITextMap;
    tooltipService: ITooltipService;
    theme: IThemeService;
    previewThumbnail: IPreviewThumbnail;
    previewFullSize: IPreviewFullSize;
  }) {
    this._engine = engine;
    this._liveStateEngine = liveStateEngine;
    this._eventEmitter = eventEmitter;
    this._textMap = textMap;
    this._tooltipService = tooltipService;
    this._previewThumbnail = previewThumbnail;
    this._previewFullSize = previewFullSize;

    this._isUserDragging = false;
    this._desiredSeekPosition = 0;
    this._theme = theme;

    this._timeIndicatorsToAdd = [];

    this._showFullScreenPreview = false;

    this._bindCallbacks();
    this._initUI();
    this._bindEvents();

    this.view.setPlayed(0);
    this.view.setBuffered(0);

    this._initInterceptor();
  }

  getElement() {
    return this.view.getElement();
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [VIDEO_EVENTS.STATE_CHANGED, this._processStateChange],
        [VIDEO_EVENTS.LIVE_STATE_CHANGED, this._processLiveStateChange],
        [VIDEO_EVENTS.CHUNK_LOADED, this._updateBufferIndicator],
        [VIDEO_EVENTS.DURATION_UPDATED, this._updateAllIndicators],
        [UI_EVENTS.RESIZE, this.view.updateOnResize, this.view],
      ],
      this,
    );
  }

  private _initUI() {
    const config: IProgressViewConfig = {
      callbacks: {
        onSyncWithLiveClick: this._syncWithLive,
        onSyncWithLiveMouseEnter: this._onSyncWithLiveMouseEnter,
        onSyncWithLiveMouseLeave: this._onSyncWithLiveMouseLeave,
        onChangePlayedPercent: this._onChangePlayedPercent,
        onSeekToByMouseStart: this._showTooltipAndPreview,
        onSeekToByMouseEnd: this._hideTooltip,
        onDragStart: this._startProcessingUserDrag,
        onDragEnd: this._stopProcessingUserDrag,
      },
      theme: this._theme,
      textMap: this._textMap,
      tooltipService: this._tooltipService,
    };

    this.view = new ProgressControl.View(config);
  }

  private _initInterceptor() {
    this._interceptor = new KeyboardInterceptor(this.view.getElement(), {
      [KEYCODES.UP_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD);
        this._engine.seekForward(AMOUNT_TO_SKIP_SECONDS);
      },
      [KEYCODES.DOWN_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD);
        this._engine.seekBackward(AMOUNT_TO_SKIP_SECONDS);
      },
      [KEYCODES.RIGHT_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_FORWARD_WITH_KEYBOARD);
        this._engine.seekForward(AMOUNT_TO_SKIP_SECONDS);
      },
      [KEYCODES.LEFT_ARROW]: e => {
        e.stopPropagation();
        e.preventDefault();
        this._eventEmitter.emit(UI_EVENTS.KEYBOARD_KEYDOWN_INTERCEPTED);
        this._eventEmitter.emit(UI_EVENTS.GO_BACKWARD_WITH_KEYBOARD);
        this._engine.seekBackward(AMOUNT_TO_SKIP_SECONDS);
      },
    });
  }

  private _destroyInterceptor() {
    this._interceptor.destroy();
  }

  private _bindCallbacks() {
    this._syncWithLive = this._syncWithLive.bind(this);
    this._onSyncWithLiveMouseEnter = this._onSyncWithLiveMouseEnter.bind(this);
    this._onSyncWithLiveMouseLeave = this._onSyncWithLiveMouseLeave.bind(this);
    this._updateAllIndicators = this._updateAllIndicators.bind(this);
    this._onChangePlayedPercent = this._onChangePlayedPercent.bind(this);
    this._showTooltipAndPreview = this._showTooltipAndPreview.bind(this);
    this._hideTooltip = this._hideTooltip.bind(this);
    this._startProcessingUserDrag = this._startProcessingUserDrag.bind(this);
    this._stopProcessingUserDrag = this._stopProcessingUserDrag.bind(this);
  }

  private _startIntervalUpdates() {
    if (this._updateControlInterval) {
      this._stopIntervalUpdates();
    }

    this._updateAllIndicators();

    this._updateControlInterval = window.setInterval(
      this._updateAllIndicators,
      UPDATE_INTERVAL_DELAY,
    );
  }

  private _stopIntervalUpdates() {
    window.clearInterval(this._updateControlInterval);
    this._updateControlInterval = null;
  }

  private _convertPlayedPercentToTime(percent: number): number {
    const duration = this._engine.getDuration();
    return (duration * percent) / 100;
  }

  private _onChangePlayedPercent(percent: number) {
    const newTime = this._convertPlayedPercentToTime(percent);
    if (this._showFullScreenPreview) {
      this._desiredSeekPosition = newTime;

      this._eventEmitter.emit(
        UI_EVENTS.PROGRESS_USER_PREVIEWING_FRAME,
        newTime,
      );
    } else {
      this._changeCurrentTimeOfVideo(newTime);
    }

    if (this._isUserDragging) {
      this._showTooltipAndPreview(percent);
    }
  }

  private _showTooltipAndPreview(percent: number) {
    const duration = this._engine.getDuration();
    const seekToTime = this._convertPlayedPercentToTime(percent);
    const timeToShow = this._engine.isDynamicContent
      ? seekToTime - duration
      : seekToTime;

    this._previewThumbnail.setTime(formatTime(timeToShow));
    this._previewThumbnail.showAt(seekToTime);
    this.view.showProgressTimeTooltip(
      this._previewThumbnail.getElement(),
      percent,
    );

    if (this._isUserDragging && this._showFullScreenPreview) {
      this._previewFullSize.showAt(seekToTime);
    }
  }

  private _hideTooltip() {
    if (!this._isUserDragging) {
      this.view.hideProgressTimeTooltip();
    }
  }

  private _startProcessingUserDrag() {
    if (!this._isUserDragging) {
      this._isUserDragging = true;

      this._pauseVideoOnDragStart();

      this._eventEmitter.emit(UI_EVENTS.PROGRESS_DRAG_STARTED);
      this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_START);
    }
  }

  private _stopProcessingUserDrag() {
    if (this._isUserDragging) {
      this._isUserDragging = false;

      if (this._showFullScreenPreview) {
        this._shouldHidePreviewOnUpdate = true;
      }
      if (this._showFullScreenPreview) {
        this._changeCurrentTimeOfVideo(this._desiredSeekPosition);
      }
      this._playVideoOnDragEnd();

      this.view.hideProgressTimeTooltip();

      this._eventEmitter.emit(UI_EVENTS.PROGRESS_DRAG_ENDED);
      this._eventEmitter.emit(UI_EVENTS.CONTROL_DRAG_END);
    }
  }

  private _hidePreview() {
    this._shouldHidePreviewOnUpdate = false;
    this._previewFullSize.hide();
  }

  private _processStateChange({ nextState }: { nextState: EngineState }) {
    switch (nextState) {
      case EngineState.SRC_SET:
        this._reset();
        break;
      case EngineState.METADATA_LOADED:
        this._initTimeIndicators();

        if (this._engine.isSeekAvailable) {
          this.show();
        } else {
          this.hide();
        }

        break;
      case EngineState.PLAYING:
        if (this._shouldHidePreviewOnUpdate) {
          this._hidePreview();
        }
        if (this._liveStateEngine.state === LiveState.SYNC) {
          this.view.setPlayed(100);
        } else {
          this._startIntervalUpdates();
        }
        break;
      case EngineState.PAUSED:
        if (this._shouldHidePreviewOnUpdate) {
          this._hidePreview();
        }
        this._stopIntervalUpdates();
        break;
      case EngineState.SEEK_IN_PROGRESS:
        this._updateAllIndicators();
        break;
      default:
        break;
    }
  }

  private _processLiveStateChange({ nextState }: { nextState: LiveState }) {
    switch (nextState) {
      case LiveState.NONE:
        this.view.setLiveSyncState(false);
        this.view.setUsualMode();
        break;

      case LiveState.INITIAL:
        this.view.setLiveMode();
        break;

      case LiveState.SYNC:
        this.view.setLiveSyncState(true);
        break;

      case LiveState.NOT_SYNC:
        this.view.setLiveSyncState(false);
        break;

      case LiveState.ENDED:
        this.view.setLiveSyncState(false);
        this.view.hideSyncWithLive();

        // ensure progress indicators show latest info
        if (this._engine.getCurrentState() === EngineState.PLAYING) {
          this._startIntervalUpdates();
        } else {
          this._updateAllIndicators();
        }
        break;

      default:
        break;
    }
  }

  private _changeCurrentTimeOfVideo(newTime: number) {
    const duration = this._engine.getDuration();

    if (this._engine.isDynamicContent && duration === newTime) {
      this._engine.syncWithLive();
    } else {
      this._engine.seekTo(newTime);
    }

    this._eventEmitter.emit(UI_EVENTS.PROGRESS_CHANGE, newTime);
  }

  private _pauseVideoOnDragStart() {
    const currentState = this._engine.getCurrentState();

    if (
      currentState === EngineState.PLAYING ||
      currentState === EngineState.PLAY_REQUESTED
    ) {
      this._shouldPlayAfterDragEnd = true;
      this._engine.pause();
    }

    this._eventEmitter.emit(UI_EVENTS.PROGRESS_DRAG_STARTED);
  }

  private _playVideoOnDragEnd() {
    if (this._shouldPlayAfterDragEnd) {
      this._engine.play();

      this._shouldPlayAfterDragEnd = false;
    }
  }

  private _updateBufferIndicator() {
    const currentTime = this._engine.getCurrentTime();
    const buffered = this._engine.getBuffered();
    const duration = this._engine.getDuration();

    this._setBuffered(
      getOverallBufferedPercent(buffered, currentTime, duration),
    );
  }

  private _updatePlayedIndicator() {
    if (this._liveStateEngine.state === LiveState.SYNC) {
      // TODO: mb use this.updatePlayed(100) here?
      return;
    }

    const currentTime = this._engine.getCurrentTime();
    const duration = this._engine.getDuration();

    this._setPlayed(getOverallPlayedPercent(currentTime, duration));
  }

  private _updateAllIndicators() {
    this._updatePlayedIndicator();
    this._updateBufferIndicator();
  }

  private _initTimeIndicators() {
    this._timeIndicatorsToAdd.forEach(time => {
      this._addTimeIndicator(time);
    });
    this._timeIndicatorsToAdd = [];
  }

  private _addTimeIndicator(time: number) {
    const durationTime = this._engine.getDuration();

    if (time > durationTime) {
      // TODO: log error for developers
      return;
    }

    this.view.addTimeIndicator(getTimePercent(time, durationTime));
  }

  private _syncWithLive() {
    this._engine.syncWithLive();
  }

  private _onSyncWithLiveMouseEnter() {
    this._eventEmitter.emit(UI_EVENTS.PROGRESS_SYNC_BUTTON_MOUSE_ENTER);
  }

  private _onSyncWithLiveMouseLeave() {
    this._eventEmitter.emit(UI_EVENTS.PROGRESS_SYNC_BUTTON_MOUSE_LEAVE);
  }

  private _setPlayed(percent: number) {
    this.view.setPlayed(percent);
  }

  private _setBuffered(percent: number) {
    this.view.setBuffered(percent);
  }

  private _reset() {
    this._setPlayed(0);
    this._setBuffered(0);
    this.clearTimeIndicators();
  }

  /**
   * Player will show full screen preview instead of actual seek on video when user drag the progress control
   * @example
   * player.showPreviewOnProgressDrag();
   */
  @playerAPI()
  showPreviewOnProgressDrag() {
    this._showFullScreenPreview = true;
  }

  /**
   * Player will seek on video when user drag the progress control
   * @example
   * player.seekOnProgressDrag();
   */
  @playerAPI()
  seekOnProgressDrag() {
    this._showFullScreenPreview = false;
  }

  /**
   * Add time indicator to progress bar
   */
  @playerAPI()
  addTimeIndicator(time: number) {
    this.addTimeIndicators([time]);
  }

  /**
   * Add time indicators to progress bar
   */
  @playerAPI()
  addTimeIndicators(times: number[]) {
    if (!this._engine.isMetadataLoaded) {
      // NOTE: Add indicator after metadata loaded
      this._timeIndicatorsToAdd.push(...times);
      return;
    }

    times.forEach(time => {
      this._addTimeIndicator(time);
    });
  }

  /**
   * Delete all time indicators from progress bar
   */
  @playerAPI()
  clearTimeIndicators() {
    this.view.clearTimeIndicators();
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  destroy() {
    this._destroyInterceptor();
    this._stopIntervalUpdates();
    this._unbindEvents();
    this.view.destroy();
  }
}
