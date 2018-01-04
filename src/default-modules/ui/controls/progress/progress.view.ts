import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import { Progress, ProgressTimeIndicator } from './templates';

import htmlToElement from '../../core/htmlToElement';

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

class ProgressView extends View {
  private _callbacks;
  private _texts;
  private _isDragging: boolean;

  private _$node: HTMLElement;
  private _$hitbox: HTMLElement;
  private _$played: HTMLElement;
  private _$buffered: HTMLElement;
  private _$seekTo: HTMLElement;
  private _$timeIndicators: HTMLElement;
  private _$syncButton: HTMLElement;

  constructor(config) {
    super();
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;

    this._initDOM();
    this._bindCallbacks();
    this._bindEvents();

    this._setPlayedDOMAttributes(0);
    this._setBufferedDOMAttributes(0);
  }

  private _initDOM() {
    this._$node = htmlToElement(Progress({ styles: this.styleNames }));

    this._$played = this._$node.querySelector('[data-hook="progress-played"]');
    this._$buffered = this._$node.querySelector(
      '[data-hook="progress-buffered"]',
    );
    this._$seekTo = this._$node.querySelector('[data-hook="progress-seek-to"]');
    this._$timeIndicators = this._$node.querySelector(
      '[data-hook="progress-time-indicators"]',
    );
    this._$syncButton = this._$node.querySelector('[data-hook="progress-sync-button"]');

    this._$hitbox = this._$node.querySelector('[data-hook="progress-hitbox"]');
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
    this._$node.classList.add(this.styleNames['is-dragging']);
  }

  private _stopDrag() {
    if (this._isDragging) {
      this._isDragging = false;
      this._callbacks.onDragEnd();
      this._$node.classList.remove(this.styleNames['is-dragging']);
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

  setLiveMode() {
    this._$node.classList.add(this.styleNames['in-live']);

    this._showSyncWithLive();
  }

  setUsualMode() {
    this._$node.classList.remove(this.styleNames['in-live']);

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
        ProgressTimeIndicator({
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

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
    delete this._$buffered;
    delete this._$hitbox;
    delete this._$played;
    delete this._$seekTo;
    delete this._$timeIndicators;

    delete this._texts;
  }
}

ProgressView.extendStyleNames(styles);

export default ProgressView;
