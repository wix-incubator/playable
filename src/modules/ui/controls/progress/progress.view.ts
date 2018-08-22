import { TEXT_LABELS } from '../../../../constants';

import View from '../../core/view';

import { IView } from '../../core/types';
import { ITooltipReference, ITooltipService } from '../../core/tooltip/types';
import getProgressTimeTooltipPosition from './utils/getProgressTimeTooltipPosition';
import { progressTemplate, progressTimeIndicatorTemplate } from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';
import toggleElementClass from '../../core/toggleElementClass';

import {
  IProgressViewStyles,
  IProgressViewCallbacks,
  IProgressViewConfig,
} from './types';
import { ITextMap } from '../../../text-map/types';

import progressViewTheme from './progress.theme';
import styles from './progress.scss';

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

  return ((event.clientX - boundingRect.left) / boundingRect.width) * 100;
};

class ProgressView extends View<IProgressViewStyles>
  implements IView<IProgressViewStyles> {
  private _callbacks: IProgressViewCallbacks;
  private _textMap: ITextMap;
  private _tooltipService: ITooltipService;
  private _syncButtonTooltipReference: ITooltipReference;

  private _isDragging: boolean;

  private _$rootElement: HTMLElement;
  private _$hitbox: HTMLElement;
  private _$played: HTMLElement;
  private _$buffered: HTMLElement;
  private _$seekTo: HTMLElement;
  private _$timeIndicators: HTMLElement;
  private _$seekButton: HTMLElement;
  private _$syncButton: HTMLElement;

  constructor(config: IProgressViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;
    this._textMap = textMap;
    this._tooltipService = tooltipService;

    this._initDOM();
    this._bindCallbacks();
    this._bindEvents();

    this._setPlayedDOMAttributes(0);
    this._setBufferedDOMAttributes(0);
    this.setUsualMode();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      progressTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
      }),
    );

    this._$played = getElementByHook(
      this._$rootElement,
      'playable-progress-played',
    );
    this._$buffered = getElementByHook(
      this._$rootElement,
      'playable-progress-buffered',
    );
    this._$seekTo = getElementByHook(
      this._$rootElement,
      'playable-progress-seek-to',
    );
    this._$timeIndicators = getElementByHook(
      this._$rootElement,
      'playable-progress-time-indicators',
    );
    this._$seekButton = getElementByHook(
      this._$rootElement,
      'playable-progress-seek-button',
    );
    this._$syncButton = getElementByHook(
      this._$rootElement,
      'playable-progress-sync-button',
    );
    this._syncButtonTooltipReference = this._tooltipService.createReference(
      this._$syncButton,
      {
        text: this._textMap.get(TEXT_LABELS.LIVE_SYNC_TOOLTIP),
      },
    );
    this._$hitbox = getElementByHook(
      this._$rootElement,
      'playable-progress-hitbox',
    );
  }

  private _bindCallbacks() {
    this._setPlayedByDrag = this._setPlayedByDrag.bind(this);
    this._startDragOnMouseDown = this._startDragOnMouseDown.bind(this);
    this._stopDragOnMouseUp = this._stopDragOnMouseUp.bind(this);
    this._startSeekToByMouse = this._startSeekToByMouse.bind(this);
    this._stopSeekToByMouse = this._stopSeekToByMouse.bind(this);
    this._syncWithLive = this._syncWithLive.bind(this);
  }

  private _bindEvents() {
    this._$seekButton.addEventListener('mousedown', this._startDragOnMouseDown);
    this._$seekButton.addEventListener('mousemove', this._startSeekToByMouse);
    this._$seekButton.addEventListener('mouseout', this._stopSeekToByMouse);

    this._$hitbox.addEventListener('mousedown', this._startDragOnMouseDown);
    this._$hitbox.addEventListener('mousemove', this._startSeekToByMouse);
    this._$hitbox.addEventListener('mouseout', this._stopSeekToByMouse);

    window.addEventListener('mousemove', this._setPlayedByDrag);
    window.addEventListener('mouseup', this._stopDragOnMouseUp);

    this._$syncButton.addEventListener('click', this._syncWithLive);
    this._$syncButton.addEventListener(
      'mouseenter',
      this._callbacks.onSyncWithLiveMouseEnter,
    );
    this._$syncButton.addEventListener(
      'mouseleave',
      this._callbacks.onSyncWithLiveMouseLeave,
    );
  }

  private _unbindEvents() {
    this._$seekButton.removeEventListener(
      'mousedown',
      this._startDragOnMouseDown,
    );
    this._$seekButton.removeEventListener(
      'mousemove',
      this._startSeekToByMouse,
    );
    this._$seekButton.removeEventListener('mouseout', this._stopSeekToByMouse);

    this._$hitbox.removeEventListener('mousedown', this._startDragOnMouseDown);
    this._$hitbox.removeEventListener('mousemove', this._startSeekToByMouse);
    this._$hitbox.removeEventListener('mouseout', this._stopSeekToByMouse);

    window.removeEventListener('mousemove', this._setPlayedByDrag);
    window.removeEventListener('mouseup', this._stopDragOnMouseUp);

    this._$syncButton.removeEventListener('click', this._syncWithLive);
    this._$syncButton.removeEventListener(
      'mouseenter',
      this._callbacks.onSyncWithLiveMouseEnter,
    );
    this._$syncButton.removeEventListener(
      'mouseleave',
      this._callbacks.onSyncWithLiveMouseLeave,
    );
  }

  private _startDragOnMouseDown(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    const percent = getPercentBasedOnXPosition(event, this._$hitbox);
    this._setPlayedDOMAttributes(percent);
    this._callbacks.onChangePlayedPercent(percent);

    this._startDrag();
  }

  private _stopDragOnMouseUp(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    this._stopDrag();
  }

  private _startSeekToByMouse(event: MouseEvent) {
    const percent = getPercentBasedOnXPosition(event, this._$hitbox);

    this._setSeekToDOMAttributes(percent);
    this._callbacks.onSeekToByMouseStart(percent);
  }

  private _stopSeekToByMouse() {
    this._setSeekToDOMAttributes(0);
    this._callbacks.onSeekToByMouseEnd();
  }

  private _setPlayedByDrag(event: MouseEvent) {
    if (this._isDragging) {
      const percent = getPercentBasedOnXPosition(event, this._$hitbox);
      this._setPlayedDOMAttributes(percent);
      this._callbacks.onChangePlayedPercent(percent);
    }
  }

  private _startDrag() {
    this._isDragging = true;
    this._callbacks.onDragStart();
    this._$rootElement.classList.add(this.styleNames.isDragging);
  }

  private _stopDrag() {
    if (this._isDragging) {
      this._isDragging = false;
      this._callbacks.onDragEnd();
      this._$rootElement.classList.remove(this.styleNames.isDragging);
    }
  }

  private _setSeekToDOMAttributes(percent: number) {
    this._$seekTo.setAttribute('style', `width:${percent}%;`);
  }

  private _setPlayedDOMAttributes(percent: number) {
    this._$rootElement.setAttribute(
      'aria-valuetext',
      this._textMap.get(TEXT_LABELS.PROGRESS_CONTROL_VALUE, { percent }),
    );
    this._$rootElement.setAttribute('aria-valuenow', String(percent));
    this._$rootElement.setAttribute(DATA_PLAYED, String(percent));
    this._$played.setAttribute('style', `width:${percent}%;`);
    this._$seekButton.setAttribute('style', `left:${percent}%;`);
  }

  private _setBufferedDOMAttributes(percent: number) {
    this._$buffered.setAttribute('style', `width:${percent}%;`);
  }

  private _syncWithLive() {
    this._callbacks.onSyncWithLiveClick();
  }

  showSyncWithLive() {
    this._$syncButton.classList.remove(this.styleNames.hidden);
  }

  hideSyncWithLive() {
    this._$syncButton.classList.add(this.styleNames.hidden);
  }

  setLiveSyncStatus(isSync: boolean) {
    toggleElementClass(this._$syncButton, this.styleNames.liveSync, isSync);

    if (isSync) {
      this._syncButtonTooltipReference.disable();
      this._$played.setAttribute('style', `width:100%;`);
      this._$seekButton.setAttribute('style', `left:100%;`);
    } else {
      this._syncButtonTooltipReference.enable();
    }
  }

  showProgressTimeTooltip(element: HTMLElement, percent: number) {
    this._tooltipService.show({
      element,
      position: tooltipContainerNode =>
        getProgressTimeTooltipPosition(
          percent,
          this._$hitbox,
          tooltipContainerNode,
        ),
    });
  }

  hideProgressTimeTooltip() {
    this._tooltipService.hide();
  }

  setLiveMode() {
    this._$rootElement.classList.add(this.styleNames.inLive);

    this.showSyncWithLive();
  }

  setUsualMode() {
    this._$rootElement.classList.remove(this.styleNames.inLive);

    this.hideSyncWithLive();
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
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  getNode() {
    return this._$rootElement;
  }

  destroy() {
    this._unbindEvents();
    this._callbacks = null;

    this._syncButtonTooltipReference.destroy();
    this._syncButtonTooltipReference = null;

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
    this._$buffered = null;
    this._$hitbox = null;
    this._$played = null;
    this._$seekTo = null;
    this._$seekButton = null;
    this._$syncButton = null;
    this._$timeIndicators = null;

    this._textMap = null;
  }
}

ProgressView.setTheme(progressViewTheme);
ProgressView.extendStyleNames(styles);

export default ProgressView;
