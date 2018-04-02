import View from '../core/view';
import { IView } from '../core/types';

import { subtitlesTemplate, singleSubtitleTemplate } from './templates';
import htmlToElement from '../core/htmlToElement';
import getElementByHook from '../core/getElementByHook';

import { ISubtitlesViewStyles } from './types';

import styles from './subtitles.scss';

class SubtitlesView extends View<ISubtitlesViewStyles>
  implements IView<ISubtitlesViewStyles> {
  private _$node: HTMLElement;
  private _$subtitles: HTMLElement;

  constructor() {
    super();

    this._initDOM();
  }

  private _initDOM(): void {
    this._$node = htmlToElement(
      subtitlesTemplate({
        styles: this.styleNames,
      }),
    );

    this._$subtitles = getElementByHook(this._$node, 'subtitles-container');
  }

  getNode(): HTMLElement {
    return this._$node;
  }

  destroy(): void {
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    this._$node = null;
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
      const subtitleNode = htmlToElement(
        singleSubtitleTemplate({
          styles: this.styleNames,
        }),
      );
      subtitleNode.innerHTML = subtitle;
      this._$subtitles.appendChild(subtitleNode);
    });
  }

  show(): void {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  hide(): void {
    this._$node.classList.add(this.styleNames.hidden);
  }

  clearSubtitles(): void {
    this._$subtitles.innerHTML = '';
  }
}

SubtitlesView.extendStyleNames(styles);

export default SubtitlesView;
