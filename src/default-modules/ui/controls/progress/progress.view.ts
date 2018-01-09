import { TEXT_LABELS } from '../../../../constants/index';

import Stylable from '../../core/stylable';
import { IView } from '../../core/types';
import { ITooltip, ITooltipService } from '../../core/tooltip';

import { progressTemplate, progressTimeIndicatorTemplate } from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import {
  IProgressViewStyles,
  IProgressViewCallbacks,
  IProgressViewOptions,
} from './types';
import * as styles from './progress.scss';

const DATA_PLAYED = 'data-played-percent';

const getPercentBasedOnXPosition = (
  event: MouseEvent,
  element: HTMLElement,
) => {
  const boundingRect = element.getBoundingClientRect();
  const positionX = event.clientX;

  if (positionX < boundingRect.left) {
    return 0;
  }

  if (positionX > boundingRect.left + boundingRect.width) {
    return 100;
  }

  return (event.clientX - boundingRect.left) / boundingRect.width * 100;
};

class ProgressView extends Stylable<IProgressViewStyles>
  implements IView<IProgressViewStyles> {
  private _callbacks: IProgressViewCallbacks;
  private _texts;
  private _tooltipService: ITooltipService;
  private _syncButtonTooltip: ITooltip;
  private _isDragging: boolean;

  private _$node: HTMLElement;
  private _$hitbox: HTMLElement;
  private _$played: HTMLElement;
  private _$buffered: HTMLElement;
  private _$seekTo: HTMLElement;
  private _$timeIndicators: HTMLElement;
  private _$syncButton: HTMLElement;

  constructor(config: IProgressViewOptions) {
    super();
    const { callbacks, texts, tooltipService } = config;

    this._callbacks = callbacks;
    this._texts = texts;
    this._tooltipService = tooltipService;

    this._initDOM();
    this._bindCallbacks();
    this._bindEvents();

    this._setPlayedDOMAttributes(0);
    this._setBufferedDOMAttributes(0);
    this.setUsualMode();
  }

  private _initDOM() {
    this._$node = htmlToElement(progressTemplate({ styles: this.styleNames }));

    this._$played = getElementByHook(this._$node, 'progress-played');
    this._$buffered = getElementByHook(this._$node, 'progress-buffered');
    this._$seekTo = getElementByHook(this._$node, 'progress-seek-to');
    this._$timeIndicators = getElementByHook(
      this._$node,
      'progress-time-indicators',
    );
    this._$syncButton = getElementByHook(this._$node, 'progress-sync-button');
    this._syncButtonTooltip = this._tooltipService.create(
      this._$syncButton,
      {
        title: this._texts.get(TEXT_LABELS.LIVE_SYNC_TOOLTIP),
      },
    );
    this._$hitbox = getElementByHook(this._$node, 'progress-hitbox');
  }

  private _bindCallbacks() {
    this._setPlayedByDrag = this._setPlayedByDrag.bind(this);
    this._startDragOnMouseDown = this._startDragOnMouseDown.bind(this);
    this._stopDragOnMouseUp = this._stopDragOnMouseUp.bind(this);
    this._setSeekToByMouse = this._setSeekToByMouse.bind(this);
    this._resetSeek = this._resetSeek.bind(this);
    this._syncWithLive = this._syncWithLive.bind(this);
  }

  private _bindEvents() {
    this._$hitbox.addEventListener('mousedown', this._startDragOnMouseDown);
    this._$hitbox.addEventListener('mousemove', this._setSeekToByMouse);
    this._$hitbox.addEventListener('mouseout', this._resetSeek);

    window.addEventListener('mousemove', this._setPlayedByDrag);
    window.addEventListener('mouseup', this._stopDragOnMouseUp);

    this._$syncButton.addEventListener('click', this._syncWithLive);
  }

  private _unbindEvents() {
    this._$hitbox.removeEventListener('mousedown', this._startDragOnMouseDown);
    this._$hitbox.removeEventListener('mousemove', this._setSeekToByMouse);
    this._$hitbox.removeEventListener('mouseout', this._resetSeek);
    this._$syncButton.removeEventListener('click', this._syncWithLive);

    window.removeEventListener('mousemove', this._setPlayedByDrag);
    window.removeEventListener('mouseup', this._stopDragOnMouseUp);
  }

  private _startDragOnMouseDown(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    const percent = getPercentBasedOnXPosition(event, this._$hitbox);
    this._setPlayedDOMAttributes(percent);
    this._callbacks.onChangePlayedProgress(percent);

    this._startDrag();
  }

  private _stopDragOnMouseUp(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    this._stopDrag();
  }

  private _resetSeek() {
    this._setSeekToDOMAttributes(0);
  }

  private _setSeekToByMouse(event: MouseEvent) {
    const percent = getPercentBasedOnXPosition(event, this._$hitbox);

    this._setSeekToDOMAttributes(percent);
  }

  private _setPlayedByDrag(event: MouseEvent) {
    if (this._isDragging) {
      const percent = getPercentBasedOnXPosition(event, this._$hitbox);
      this._setPlayedDOMAttributes(percent);
      this._callbacks.onChangePlayedProgress(percent);
    }
  }

  private _startDrag() {
    this._isDragging = true;
    this._callbacks.onDragStart();
    this._$node.classList.add(this.styleNames.isDragging);
  }

  private _stopDrag() {
    if (this._isDragging) {
      this._isDragging = false;
      this._callbacks.onDragEnd();
      this._$node.classList.remove(this.styleNames.isDragging);
    }
  }

  private _setSeekToDOMAttributes(percent: number) {
    this._$seekTo.setAttribute('style', `width:${percent}%;`);
  }

  private _setPlayedDOMAttributes(percent: number) {
    this._$node.setAttribute(
      'aria-valuetext',
      this._texts.get(TEXT_LABELS.PROGRESS_CONTROL_VALUE, { percent }),
    );
    this._$node.setAttribute('aria-valuenow', String(percent));
    this._$node.setAttribute(DATA_PLAYED, String(percent));
    this._$played.setAttribute('style', `width:${percent}%;`);
  }

  private _setBufferedDOMAttributes(percent: number) {
    this._$buffered.setAttribute('style', `width:${percent}%;`);
  }

  private _syncWithLive() {
    this._callbacks.onSyncWithLiveClick();
  }

  private _showSyncWithLive() {
    this._$syncButton.classList.remove(this.styleNames.hidden);
  }

  private _hideSyncWithLive() {
    this._$syncButton.classList.add(this.styleNames.hidden);
  }

  setLiveSyncStatus(isSync) {
    if (isSync) {
      this._$syncButton.classList.add(this.styleNames.liveSync);
      this._$played.setAttribute('style', `width:100%;`);
    } else {
      this._$syncButton.classList.remove(this.styleNames.liveSync);
    }
  }

  setLiveMode() {
    this._$node.classList.add(this.styleNames.inLive);

    this._showSyncWithLive();
  }

  setUsualMode() {
    this._$node.classList.remove(this.styleNames.inLive);

    this._hideSyncWithLive();
  }

  setPlayed(percent: number) {
    this._setPlayedDOMAttributes(percent);
  }

  setBuffered(percent: number) {
    this._setBufferedDOMAttributes(percent);
  }

  addTimeIndicator(percent: number) {
    this._$timeIndicators.appendChild(
      htmlToElement(
        progressTimeIndicatorTemplate({
          percent,
          styles: this.styleNames,
        }),
      ),
    );
  }

  clearTimeIndicators() {
    this._$timeIndicators.innerHTML = '';
  }

  hide() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  getNode() {
    return this._$node;
  }

  destroy() {
    this._unbindEvents();
    this._syncButtonTooltip.destroy();

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
    delete this._$buffered;
    delete this._$hitbox;
    delete this._$played;
    delete this._$seekTo;
    delete this._$syncButton;
    delete this._$timeIndicators;

    delete this._texts;
  }
}

ProgressView.extendStyleNames(styles);

export default ProgressView;
