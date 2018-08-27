import { TEXT_LABELS } from '../../../../constants';

import View from '../../core/view';
import { IView } from '../../core/types';

import {
  controlTemplate,
  playIconTemplate,
  pauseIconTemplate,
} from './templates';

import htmlToElement from '../../core/htmlToElement';
import getElementByHook from '../../core/getElementByHook';

import { IPlayViewStyles, IPlayViewCallbacks, IPlayViewConfig } from './types';
import { ITextMap } from '../../../text-map/types';

import playViewTheme from './play.theme';
import styles from './play.scss';

const DATA_IS_PLAYING = 'data-is-playing';

class PlayView extends View<IPlayViewStyles> implements IView<IPlayViewStyles> {
  private _callbacks: IPlayViewCallbacks;
  private _textMap: ITextMap;

  private _$rootElement: HTMLElement;
  private _$playbackControl: HTMLElement;

  constructor(config: IPlayViewConfig) {
    const { callbacks, textMap, theme } = config;

    super(theme);

    this._callbacks = callbacks;
    this._textMap = textMap;

    this._$rootElement = htmlToElement(
      controlTemplate({
        styles: this.styleNames,
        texts: {
          label: this._textMap.get(TEXT_LABELS.PLAY_CONTROL_LABEL),
        },
      }),
    );

    this._$playbackControl = getElementByHook(
      this._$rootElement,
      'playable-playback-control',
    );

    this.setPlayingState(false);
    this._bindEvents();
  }

  private _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._$playbackControl.addEventListener('click', this._onButtonClick);
  }

  private _unbindEvents() {
    this._$playbackControl.removeEventListener('click', this._onButtonClick);
  }

  private _onButtonClick() {
    this._$playbackControl.focus();
    this._callbacks.onButtonClick();
  }

  setPlayingState(isPlaying: boolean) {
    if (isPlaying) {
      this._$playbackControl.classList.remove(this.styleNames.paused);
      this._$playbackControl.innerHTML = pauseIconTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
      });
      this._$playbackControl.setAttribute(
        'aria-label',
        this._textMap.get(TEXT_LABELS.PAUSE_CONTROL_LABEL),
      );
    } else {
      this._$playbackControl.classList.add(this.styleNames.paused);
      this._$playbackControl.innerHTML = playIconTemplate({
        styles: this.styleNames,
        themeStyles: this.themeStyles,
      });
      this._$playbackControl.setAttribute(
        'aria-label',
        this._textMap.get(TEXT_LABELS.PLAY_CONTROL_LABEL),
      );
    }

    this._$rootElement.setAttribute(DATA_IS_PLAYING, String(isPlaying));
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  getElement() {
    return this._$rootElement;
  }

  destroy() {
    this._unbindEvents();
    this._callbacks = null;

    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$playbackControl = null;
    this._$rootElement = null;
    this._textMap = null;
  }
}

PlayView.setTheme(playViewTheme);
PlayView.extendStyleNames(styles);

export default PlayView;
