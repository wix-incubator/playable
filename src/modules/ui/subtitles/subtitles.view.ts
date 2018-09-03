import View from '../core/view';
import { IView } from '../core/types';

import { subtitlesTemplate, singleSubtitleTemplate } from './templates';
import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import { ISubtitlesViewStyles } from './types';

import styles from './subtitles.scss';

class SubtitlesView extends View<ISubtitlesViewStyles>
  implements IView<ISubtitlesViewStyles> {
  private _$rootElement: HTMLElement;
  private _$subtitles: HTMLElement;

  constructor() {
    super();

    this._initDOM();
  }

  private _initDOM(): void {
    this._$rootElement = htmlToElement(
      subtitlesTemplate({
        styles: this.styleNames,
      }),
    );

    this._$subtitles = getElementByHook(
      this._$rootElement,
      'subtitles-container',
    );
  }

  getElement(): HTMLElement {
    return this._$rootElement;
  }

  destroy(): void {
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }

  moveSubtitlesUp(): void {
    this._$subtitles.classList.add(this.styleNames.controlsShown);
  }

  moveSubtitlesDown(): void {
    this._$subtitles.classList.remove(this.styleNames.controlsShown);
  }

  showSubtitles(subtitles: Array<string>): void {
    this.clearSubtitles();
    subtitles.forEach(subtitle => {
      const subtitleElement = htmlToElement(
        singleSubtitleTemplate({
          styles: this.styleNames,
        }),
      );
      subtitleElement.innerHTML = subtitle;
      this._$subtitles.appendChild(subtitleElement);
    });
  }

  show(): void {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  hide(): void {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  clearSubtitles(): void {
    this._$subtitles.innerHTML = '';
  }
}

SubtitlesView.extendStyleNames(styles);

export default SubtitlesView;
