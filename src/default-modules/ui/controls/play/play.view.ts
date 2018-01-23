import * as $ from 'jbone';

import { TEXT_LABELS } from '../../../../constants/index';

import View from '../../core/view';

import { playIconTemplate, pauseIconTemplate } from './templates';
import htmlToElement from '../../core/htmlToElement';

import { IThemeService } from '../../core/theme';

import playViewTheme from './play.theme';
import * as styles from './play.scss';

const DATA_HOOK_ATTRIBUTE = 'data-hook';
const DATA_HOOK_CONTROL_VALUE = 'playback-control';
const DATA_HOOK_BUTTON_VALUE = 'toggle-playback-button';

const DATA_IS_PLAYING = 'data-is-playing';

type IPlayViewConfig = {
  callbacks: any;
  textMap: any;
  theme: IThemeService;
};

class PlayView extends View {
  private _callbacks;
  private _textMap;

  $node;
  $playbackControl;

  constructor(config: IPlayViewConfig) {
    const { callbacks, textMap, theme } = config;

    super(theme);

    this._callbacks = callbacks;

    this._textMap = textMap;

    this.$node = $('<div>', {
      class: this.styleNames['play-control'],
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_CONTROL_VALUE,
      [DATA_IS_PLAYING]: false,
    });

    this.$playbackControl = $('<button>', {
      class: `${this.styleNames['playback-toggle']} ${
        this.styleNames['control-button']
      }`,
      [DATA_HOOK_ATTRIBUTE]: DATA_HOOK_BUTTON_VALUE,
      'aria-label': this._textMap.get(TEXT_LABELS.PLAY_CONTROL_LABEL),
      type: 'button',
      tabIndex: 0,
    });

    this.$playbackControl.append(
      htmlToElement(
        pauseIconTemplate({
          styles: this.styleNames,
          themeStyles: this.themeStyles,
        }),
      ),
    );

    this.$node.append(this.$playbackControl);

    this._bindEvents();
  }

  _bindEvents() {
    this._onButtonClick = this._onButtonClick.bind(this);

    this.$playbackControl[0].addEventListener('click', this._onButtonClick);
  }

  _unbindEvents() {
    this.$playbackControl[0].removeEventListener('click', this._onButtonClick);
  }

  _onButtonClick() {
    this.$playbackControl[0].focus();
    this._callbacks.onTogglePlaybackButtonClick();
  }

  setState({ isPlaying }) {
    this.$playbackControl.toggleClass(this.styleNames.paused, !isPlaying);

    const iconTemplate = isPlaying ? pauseIconTemplate : playIconTemplate;

    this.$playbackControl[0].innerHTML = iconTemplate({
      styles: this.styleNames,
      themeStyles: this.themeStyles,
    });

    this.$node.attr(DATA_IS_PLAYING, isPlaying);
    this.$playbackControl.attr(
      'aria-label',
      isPlaying
        ? this._textMap.get(TEXT_LABELS.PAUSE_CONTROL_LABEL)
        : this._textMap.get(TEXT_LABELS.PLAY_CONTROL_LABEL),
    );
  }

  show() {
    this.$node.toggleClass(this.styleNames.hidden, false);
  }

  hide() {
    this.$node.toggleClass(this.styleNames.hidden, true);
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this._unbindEvents();
    this.$node.remove();

    delete this.$playbackControl;
    delete this.$node;
    delete this._textMap;
  }
}

PlayView.setTheme(playViewTheme);
PlayView.extendStyleNames(styles);

export default PlayView;
