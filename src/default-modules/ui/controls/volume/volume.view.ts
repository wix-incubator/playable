import * as $ from 'jbone';
import * as classnames from 'classnames';

import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import * as styles from './volume.scss';

const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_CONTROL_VALUE = 'volume-control';
const DATA_HOOK_BUTTON_VALUE = 'mute-button';
const DATA_HOOK_INPUT_VALUE = 'volume-input';
const DATA_HOOK_VOLUME_INPUT_BLOCK_VALUE = 'volume-input-block';

const DATA_IS_MUTED = 'data-is-muted';
const DATA_VOLUME = 'data-volume-percent';

const MAX_VOLUME_ICON_RANGE = 50;

const getPercentBasedOnXPosition = (event: MouseEvent, element: HTMLElement) => {
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

class VolumeView extends View {
  private _callbacks;
  private _texts;

  _$node;
  _$muteControl;
  _$volumeNode;
  _$volume;
  _$hitbox;
  $container;
  $content;
  $inputWrapper;
  $filledProgress;
  $input;

  private _isDragging;

  constructor(config) {
    super(config);
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;

    this._bindCallbacks();
    this._createDOM();
    this._bindEvents();
  }

  _createDOM() {
    this._$node = $('<div>', {
      class: this.styleNames['volume-control'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_CONTROL_VALUE,
      [DATA_VOLUME]: 100,
      [DATA_IS_MUTED]: false,
    });

    this._$muteControl = $('<button>', {
      class: `${this.styleNames['mute-button']} ${
        this.styleNames['control-button']
      }`,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_BUTTON_VALUE,
      'aria-label': this._texts.get(TEXT_LABELS.MUTE_CONTROL_LABEL),
      type: 'button',
      tabIndex: 0,
    });

    this._$volumeNode = $('<div>', {
      class: this.styleNames['volume-input-block'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_VOLUME_INPUT_BLOCK_VALUE,
      'aria-label': this._texts.get(TEXT_LABELS.VOLUME_CONTROL_LABEL),
      'aria-valuemin': 0,
      'aria-valuenow': 0,
      'aria-valuemax': 100,
      tabIndex: 0,
    });

    this._$hitbox = $('<div>', {
      class: this.styleNames.hitbox,
    });

    this._$volume = $('<div>', {
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_INPUT_VALUE,
      class: classnames(
        this.styleNames['progress-bar'],
        this.styleNames.volume,
      ),
    });

    const background = $('<div>', {
      class: classnames(
        this.styleNames['progress-bar'],
        this.styleNames.background,
      ),
    });

    this._$volumeNode
      .append(background)
      .append(this._$volume)
      .append(this._$hitbox);

    this._$node
      .append(this._$muteControl)
      .append(this._$volumeNode);
  }

  _bindCallbacks() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._startDragOnMouseDown = this._startDragOnMouseDown.bind(this);
    this._stopDragOnMouseUp = this._stopDragOnMouseUp.bind(this);
    this._setVolumeByWheel = this._setVolumeByWheel.bind(this);
    this._setVolumeByClick = this._setVolumeByClick.bind(this);
    this._setVolumeByDrag = this._setVolumeByDrag.bind(this);
  }

  _bindEvents() {
    this._$hitbox[0].addEventListener('wheel', this._setVolumeByWheel);
    this._$hitbox[0].addEventListener('mousedown', this._startDragOnMouseDown);
    window.addEventListener('mousemove', this._setVolumeByDrag);
    window.addEventListener('mouseup', this._stopDragOnMouseUp);

    this._$muteControl[0].addEventListener('click', this._onButtonClick);
  }

  _unbindEvents() {
    this._$hitbox[0].removeEventListener('wheel', this._setVolumeByWheel);
    this._$hitbox[0].removeEventListener('mousedown', this._startDragOnMouseDown);
    window.removeEventListener('mousemove', this._setVolumeByDrag);
    window.removeEventListener('mouseup', this._stopDragOnMouseUp);

    this._$muteControl[0].removeEventListener('click', this._onButtonClick);
  }

  _startDragOnMouseDown(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }
    this._setVolumeByClick(event);
    this._startDrag();
  }

  _stopDragOnMouseUp(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    this._stopDrag();
  }

  _setVolumeByClick(event: MouseEvent) {
    this._$volumeNode[0].focus();
    this._setVolume(getPercentBasedOnXPosition(event, this._$hitbox[0]));
  }

  _setVolumeByDrag(event: MouseEvent) {
    this._isDragging && this._setVolume(getPercentBasedOnXPosition(event, this._$hitbox[0]));
  }

  _setVolumeByWheel(e: WheelEvent) {
    e.preventDefault();

    if (!e.deltaX) {
      return;
    }

    this._callbacks.onVolumeLevelChangeFromWheel(e.deltaX);
  }

  _startDrag() {
    this._isDragging = true;
    this._$node.addClass(this.styleNames['is-dragging']);
    this._callbacks.onDragStart();
  }

  _stopDrag() {
    if (this._isDragging) {
      this._isDragging = false;
      this._$node.removeClass(this.styleNames['is-dragging']);
      this._callbacks.onDragEnd();
    }
  }

  _setVolume(percent: number) {
    this._setDOMAttributes(percent);
    this._callbacks.onVolumeLevelChangeFromInput(percent);
  }

  _setDOMAttributes(percent: number) {
    this._$volumeNode.attr('value', percent);
    this._$volumeNode.attr(
      'aria-valuetext',
      this._texts.get(TEXT_LABELS.VOLUME_CONTROL_VALUE, { percent }),
    );
    this._$volumeNode.attr('aria-valuenow', percent);
    this._$volumeNode.attr(DATA_VOLUME, percent);

    this._$volume.attr('style', `width:${percent}%;`);

    this._$node.attr(DATA_VOLUME, percent);

    if (percent >= MAX_VOLUME_ICON_RANGE) {
      this._$muteControl.toggleClass(this.styleNames['half-volume'], false);
    } else {
      this._$muteControl.toggleClass(this.styleNames['half-volume'], true);
    }
  }

  _onButtonClick() {
    this._$muteControl[0].focus();
    this._callbacks.onToggleMuteClick();
  }

  setState({ volume, isMuted }) {
    volume !== undefined && this._setDOMAttributes(volume);
    isMuted !== undefined && this._setMuteStatus(isMuted);
  }

  _setMuteStatus(isMuted) {
    this._$muteControl.toggleClass(this.styleNames.muted, isMuted);
    this._$node.attr(DATA_IS_MUTED, isMuted);
    this._$muteControl.attr(
      'aria-label',
      isMuted
        ? this._texts.get(TEXT_LABELS.UNMUTE_CONTROL_LABEL)
        : this._texts.get(TEXT_LABELS.MUTE_CONTROL_LABEL),
    );
  }

  show() {
    this._$node.toggleClass(styles.hidden, false);
  }

  hide() {
    this._$node.toggleClass(styles.hidden, true);
  }

  getNode() {
    return this._$node[0];
  }

  getButtonNode() {
    return this._$muteControl[0];
  }

  getInputNode() {
    return this._$volumeNode[0];
  }

  destroy() {
    this._unbindEvents();
    this._$node.remove();

    delete this._$muteControl;
    delete this._$node;

    delete this._texts;
  }
}

VolumeView.extendStyleNames(styles);

export default VolumeView;
