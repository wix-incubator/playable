import { TEXT_LABELS } from '../../../../constants';

import { ITooltipReference, ITooltipService } from '../../core/tooltip';
import {
  controlTemplate,
  volume0IconTemplate,
  volume50IconTemplate,
  volume100IconTemplate,
} from './templates';

import View from '../../core/view';
import { IView } from '../../core/types';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import {
  IVolumeViewStyles,
  IVolumeViewCallbacks,
  IVolumeViewConfig,
} from './types';
import { ITextMap } from '../../../text-map/types';

import volumeViewTheme from './volume.theme';
import styles from './volume.scss';

const DATA_IS_MUTED = 'data-is-muted';
const DATA_VOLUME = 'data-volume-percent';

const MAX_VOLUME_ICON_RANGE = 50;

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

class VolumeView extends View<IVolumeViewStyles>
  implements IView<IVolumeViewStyles> {
  private _callbacks: IVolumeViewCallbacks;
  private _textMap: ITextMap;
  private _tooltipService: ITooltipService;
  private _muteButtonTooltipReference: ITooltipReference;

  private _$node: HTMLElement;
  private _$muteButton: HTMLElement;
  private _$volumeNode: HTMLElement;
  private _$volume: HTMLElement;
  private _$hitbox: HTMLElement;

  private _isDragging: boolean;

  constructor(config: IVolumeViewConfig) {
    const { callbacks, textMap, tooltipService, theme } = config;

    super(theme);

    this._callbacks = callbacks;

    this._textMap = textMap;
    this._tooltipService = tooltipService;

    this._bindCallbacks();
    this._initDOM();
    this._bindEvents();
  }

  private _initDOM() {
    this._$node = htmlToElement(
      controlTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
        texts: {
          muteLabel: this._textMap.get(TEXT_LABELS.MUTE_CONTROL_LABEL),
          volumeLabel: this._textMap.get(TEXT_LABELS.VOLUME_CONTROL_LABEL),
        },
      }),
    );

    this._$muteButton = getElementByHook(this._$node, 'mute-button');
    this._$volumeNode = getElementByHook(this._$node, 'volume-input-block');
    this._$hitbox = getElementByHook(this._$node, 'volume-hitbox');
    this._$volume = getElementByHook(this._$node, 'volume-input');

    this._muteButtonTooltipReference = this._tooltipService.createReference(
      this._$muteButton,
      {
        text: this._textMap.get(TEXT_LABELS.MUTE_CONTROL_TOOLTIP),
      },
    );
  }

  private _bindCallbacks() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._startDragOnMouseDown = this._startDragOnMouseDown.bind(this);
    this._stopDragOnMouseUp = this._stopDragOnMouseUp.bind(this);
    this._setVolumeByWheel = this._setVolumeByWheel.bind(this);
    this._setVolumeByClick = this._setVolumeByClick.bind(this);
    this._setVolumeByDrag = this._setVolumeByDrag.bind(this);
  }

  private _bindEvents() {
    this._$hitbox.addEventListener('wheel', this._setVolumeByWheel);
    this._$hitbox.addEventListener('mousedown', this._startDragOnMouseDown);
    window.addEventListener('mousemove', this._setVolumeByDrag);
    window.addEventListener('mouseup', this._stopDragOnMouseUp);

    this._$muteButton.addEventListener('click', this._onButtonClick);
  }

  private _unbindEvents() {
    this._$hitbox.removeEventListener('wheel', this._setVolumeByWheel);
    this._$hitbox.removeEventListener('mousedown', this._startDragOnMouseDown);
    window.removeEventListener('mousemove', this._setVolumeByDrag);
    window.removeEventListener('mouseup', this._stopDragOnMouseUp);

    this._$muteButton.removeEventListener('click', this._onButtonClick);
  }

  private _startDragOnMouseDown(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }
    this._setVolumeByClick(event);
    this._startDrag();
  }

  private _stopDragOnMouseUp(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    this._stopDrag();
  }

  private _setVolumeByClick(event: MouseEvent) {
    this._$volumeNode.focus();
    const percent = getPercentBasedOnXPosition(event, this._$hitbox);
    this._callbacks.onVolumeLevelChangeFromInput(percent);
  }

  private _setVolumeByDrag(event: MouseEvent) {
    const percent = getPercentBasedOnXPosition(event, this._$hitbox);
    if (this._isDragging) {
      this._callbacks.onVolumeLevelChangeFromInput(percent);
    }
  }

  private _setVolumeByWheel(e: WheelEvent) {
    e.preventDefault();
    const value = e.deltaX || e.deltaY * -1;

    if (!value) {
      return;
    }

    this._callbacks.onVolumeLevelChangeFromWheel(value);
  }

  private _startDrag() {
    this._isDragging = true;
    this._$node.classList.add(this.styleNames.isDragging);
    this._callbacks.onDragStart();
  }

  private _stopDrag() {
    if (this._isDragging) {
      this._isDragging = false;
      this._$node.classList.remove(this.styleNames.isDragging);
      this._callbacks.onDragEnd();
    }
  }

  private _setVolumeDOMAttributes(percent: number) {
    this._$volumeNode.setAttribute('value', String(percent));
    this._$volumeNode.setAttribute(
      'aria-valuetext',
      this._textMap.get(TEXT_LABELS.VOLUME_CONTROL_VALUE, { percent }),
    );
    this._$volumeNode.setAttribute('aria-valuenow', String(percent));
    this._$volumeNode.setAttribute(DATA_VOLUME, String(percent));

    this._$volume.setAttribute('style', `width:${percent}%;`);

    this._$node.setAttribute(DATA_VOLUME, String(percent));

    const iconTemplateProps = {
      styles: this.styleNames,
      themeStyles: this.themeStyles,
    };

    if (percent >= MAX_VOLUME_ICON_RANGE) {
      this._$muteButton.innerHTML = volume100IconTemplate(iconTemplateProps);
    } else if (percent > 0) {
      this._$muteButton.innerHTML = volume50IconTemplate(iconTemplateProps);
    } else {
      this._$muteButton.innerHTML = volume0IconTemplate(iconTemplateProps);
    }
  }

  private _onButtonClick() {
    this._$muteButton.focus();
    this._callbacks.onToggleMuteClick();
  }

  setVolume(volume: number) {
    this._setVolumeDOMAttributes(volume);
  }

  setMute(isMuted: boolean) {
    this._setMuteDOMAttributes(isMuted);
  }

  private _setMuteDOMAttributes(isMuted: boolean) {
    if (isMuted) {
      this._$muteButton.innerHTML = volume0IconTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
      });
    }

    this._$node.setAttribute(DATA_IS_MUTED, String(isMuted));
    this._$muteButton.setAttribute(
      'aria-label',
      isMuted
        ? this._textMap.get(TEXT_LABELS.UNMUTE_CONTROL_LABEL)
        : this._textMap.get(TEXT_LABELS.MUTE_CONTROL_LABEL),
    );
    this._muteButtonTooltipReference.setText(
      isMuted
        ? this._textMap.get(TEXT_LABELS.UNMUTE_CONTROL_TOOLTIP)
        : this._textMap.get(TEXT_LABELS.MUTE_CONTROL_TOOLTIP),
    );
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  getNode() {
    return this._$node;
  }

  getButtonNode() {
    return this._$muteButton;
  }

  getInputNode() {
    return this._$volumeNode;
  }

  destroy() {
    this._unbindEvents();
    this._callbacks = null;

    this._muteButtonTooltipReference.destroy();
    this._muteButtonTooltipReference = null;

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    this._$muteButton = null;
    this._$node = null;

    this._textMap = null;
  }
}

VolumeView.setTheme(volumeViewTheme);
VolumeView.extendStyleNames(styles);

export default VolumeView;
