import View from '../../core/view';
import { IView } from '../../core/types';

import formatTime from '../../core/utils/formatTime';

import { timeTemplate } from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import { ITimeViewStyles, ITimeViewConfig } from './types';
import timeViewTheme from './time.theme';
import styles from './time.scss';

class TimeView extends View<ITimeViewStyles> implements IView<ITimeViewStyles> {
  private _$rootElement: HTMLElement;
  private _$currentTime: HTMLElement;
  private _$durationTime: HTMLElement;
  private _duration: number;
  private _current: number;
  private _isBackward: boolean;
  constructor(config: ITimeViewConfig) {
    const { theme } = config;
    super(theme);

    this._initDOM();
  }

  private _initDOM() {
    this._$rootElement = htmlToElement(
      timeTemplate({ styles: this.styleNames, themeStyles: this.themeStyles }),
    );

    this._$currentTime = getElementByHook(
      this._$rootElement,
      'current-time-indicator',
    );
    this._$durationTime = getElementByHook(
      this._$rootElement,
      'duration-time-indicator',
    );
  }

  setDurationTime(duration: number) {
    if (duration !== this._duration) {
      this._duration = duration;
      this._updateDurationTime();
    }
  }

  setCurrentTime(current: number) {
    if (current !== this._current) {
      this._current = current;
      this._updateCurrentTime();
    }
  }

  setCurrentTimeBackward(_isBackward: boolean) {
    this._isBackward = _isBackward;
    this._updateCurrentTime();
  }

  private _updateDurationTime() {
    this._$durationTime.innerHTML = formatTime(this._duration);
  }

  private _updateCurrentTime() {
    if (this._isBackward) {
      this._$currentTime.innerHTML = formatTime(this._current - this._duration);
    } else {
      this._$currentTime.innerHTML = formatTime(this._current);
    }
  }

  showDuration() {
    this._$durationTime.classList.remove(this.styleNames.hidden);
  }

  hideDuration() {
    this._$durationTime.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  getNode() {
    return this._$rootElement;
  }

  destroy() {
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$currentTime = null;
    this._$durationTime = null;
    this._$rootElement = null;
  }
}

TimeView.setTheme(timeViewTheme);
TimeView.extendStyleNames(styles);

export default TimeView;
