import * as $ from 'jbone';
import * as classnames from 'classnames';
import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import * as styles from './progress.scss';

const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_CONTROL_VALUE = 'progress-control';

const DATA_PLAYED = 'data-played-percent';

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

class ProgressView extends View {
  private _callbacks;
  private _texts;
  private _isDragging: boolean;

  private _$node;
  private _$hitbox;
  private _$played;
  private _$buffered;
  private _$seekTo;

  constructor(config) {
    super(config);
    const { callbacks, texts } = config;

    this._callbacks = callbacks;
    this._texts = texts;

    this._createDOM();
    this._bindCallbacks();
    this._bindEvents();
    this._setDOMAttributes(0);
  }

  _createDOM() {
    this._$node = $('<div>', {
      class: this.styleNames['seek-block'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_CONTROL_VALUE,
      tabIndex: 0,
    });

    this._$hitbox = $('<div>', {
      class: this.styleNames.hitbox,
    });

    this._$played = $('<div>', {
      class: classnames(
        this.styleNames['progress-bar'],
        this.styleNames.played,
      ),
    });

    this._$buffered = $('<div>', {
      class: classnames(
        this.styleNames['progress-bar'],
        this.styleNames.buffered,
      ),
    });

    this._$seekTo = $('<div>', {
      class: classnames(
        this.styleNames['progress-bar'],
        this.styleNames['seek-to'],
      ),
    });

    const wrapper = $('<div>', {
      class: this.styleNames['progress-bars-wrapper'],
    });

    const background = $('<div>', {
      class: classnames(
        this.styleNames['progress-bar'],
        this.styleNames.background,
      ),
    });

    wrapper
      .append(background)
      .append(this._$buffered)
      .append(this._$seekTo)
      .append(this._$played);

    this._$node
      .append(wrapper)
      .append(this._$hitbox);
  }

  _bindCallbacks() {
    this._setPlayedByDrag = this._setPlayedByDrag.bind(this);
    this._startDragOnMouseDown = this._startDragOnMouseDown.bind(this);
    this._stopDragOnMouseUp = this._stopDragOnMouseUp.bind(this);
    this._setSeekToByMouse = this._setSeekToByMouse.bind(this);
    this._resetSeek = this._resetSeek.bind(this);
    this._setPlayedByClick = this._setPlayedByClick.bind(this);
  }

  _bindEvents() {
    this._$hitbox[0].addEventListener('mousedown', this._startDragOnMouseDown);
    this._$hitbox[0].addEventListener('mousemove', this._setSeekToByMouse);
    window.addEventListener('mousemove', this._setPlayedByDrag);
    window.addEventListener('mouseup', this._stopDragOnMouseUp);
    this._$hitbox[0].addEventListener('mouseout', this._resetSeek);
    this._$hitbox[0].addEventListener('click', this._setPlayedByClick);
  }

  _unbindEvents() {
    this._$hitbox[0].removeEventListener('mousedown', this._startDragOnMouseDown);
    this._$hitbox[0].removeEventListener('mousemove', this._setSeekToByMouse);
    window.removeEventListener('mousemove', this._setPlayedByDrag);
    window.removeEventListener('mouseup', this._stopDragOnMouseUp);
    this._$hitbox[0].removeEventListener('mouseout', this._resetSeek);
    this._$hitbox[0].removeEventListener('click', this._setPlayedByClick);
  }

  _startDragOnMouseDown(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    this._startDrag();
  }

  _stopDragOnMouseUp(event: MouseEvent) {
    if (event.button > 1) {
      return;
    }

    this._stopDrag();
  }

  _resetSeek() {
    this._setSeekTo(0);
  }

  _setSeekToByMouse(event: MouseEvent) {
    const percent = getPercentBasedOnXPosition(event, this._$hitbox[0]);

    this._setSeekTo(percent);
  }

  _setPlayedByClick(event: MouseEvent) {
    this._$node[0].focus();
    this._setPlayed(getPercentBasedOnXPosition(event, this._$hitbox[0]));
  }

  _setPlayedByDrag(event: MouseEvent) {
    this._isDragging && this._setPlayed(getPercentBasedOnXPosition(event, this._$hitbox[0]));
  }

  _startDrag() {
    this._isDragging = true;
    this._callbacks.onDragStart();
    this._$node.addClass(this.styleNames['is-dragging']);
  }

  _stopDrag() {
    if (this._isDragging) {
      this._isDragging = false;
      this._callbacks.onDragEnd();
      this._$node.removeClass(this.styleNames['is-dragging']);
    }
  }

  _setPlayed(percent: number) {
    this._setDOMAttributes(percent);
    this._callbacks.onChangePlayedProgress(percent);
  }

  _setSeekTo(percent: number) {
    this._$seekTo.attr('style', `width:${percent}%;`);
  }

  _setDOMAttributes(percent: number) {
    this._$node.attr('value', percent);
    this._$node.attr(
      'aria-valuetext',
      this._texts.get(TEXT_LABELS.PROGRESS_CONTROL_VALUE, { percent }),
    );
    this._$node.attr('aria-valuenow', percent);
    this._$node.attr(DATA_PLAYED, percent);
    this._$played.attr('style', `width:${percent}%;`);
  }

  _setBuffered(percent: number) {
    this._$buffered.attr('style', `width:${percent}%;`);
  }

  setState({ played, buffered }: { played?: number; buffered?: number }) {
    played !== undefined && this._setDOMAttributes(played);
    buffered !== undefined && this._setBuffered(buffered);
  }

  hide() {
    this._$node.toggleClass(this.styleNames.hidden, true);
  }

  show() {
    this._$node.toggleClass(this.styleNames.hidden, false);
  }

  getNode() {
    return this._$node[0];
  }

  destroy() {
    this._unbindEvents();
    this._$node.remove();

    delete this._$node;
    delete this._$buffered;
    delete this._$hitbox;
    delete this._$played;
    delete this._$seekTo;

    delete this._texts;
  }
}

ProgressView.extendStyleNames(styles);

export default ProgressView;
