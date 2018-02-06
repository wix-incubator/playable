import { TEXT_LABELS } from '../../../../constants/index';

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

import playViewTheme from './play.theme';
import * as styles from './play.scss';

const DATA_IS_PLAYING = 'data-is-playing';

class PlayView extends View<IPlayViewStyles> implements IView<IPlayViewStyles> {
  private _callbacks: IPlayViewCallbacks;
  private _textMap;

  private _$node: HTMLElement;
  private _$playbackControl: HTMLElement;

  constructor(config: IPlayViewConfig) {
    const { callbacks, textMap, theme } = config;

    super(theme);

    this._callbacks = callbacks;

    this._textMap = textMap;

    this._$node = htmlToElement(
      controlTemplate({
        styles: this.styleNames,
        texts: {
          label: this._textMap.get(TEXT_LABELS.PLAY_CONTROL_LABEL),
        },
      }),
    );

    this._$playbackControl = getElementByHook(this._$node, 'playback-control');

    this.setState({ isPlaying: false });

    this._bindEvents();
  }

  _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this._$playbackControl.addEventListener('click', this._onButtonClick);
  }

  _unbindEvents() {
    this._$playbackControl.removeEventListener('click', this._onButtonClick);
  }

  _onButtonClick() {
    this._$playbackControl.focus();
    this._callbacks.onButtonClick();
  }

  setState({ isPlaying }) {
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

    this._$node.setAttribute(DATA_IS_PLAYING, isPlaying);
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

  destroy() {
    this._unbindEvents();

    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$playbackControl;
    delete this._$node;
    delete this._textMap;
  }
}

PlayView.setTheme(playViewTheme);
PlayView.extendStyleNames(styles);

export default PlayView;
