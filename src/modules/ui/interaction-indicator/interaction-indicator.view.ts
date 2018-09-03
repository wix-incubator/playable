import View from '../core/view';
import { IView } from '../core/types';

import {
  containerTemplate,
  playIconTemplate,
  pauseIconTemplate,
  forwardIconTemplate,
  rewindIconTemplate,
  increaseVolumeIconTemplate,
  decreaseVolumeIconTemplate,
  muteIconTemplate,
} from './templates';

import htmlToElement from '../core/htmlToElement';

import { IInteractionIndicatorViewStyles } from './types';

import styles from './interaction-indicator.scss';

const SECONDS_COUNT = 5;

class InteractionIndicatorView extends View<IInteractionIndicatorViewStyles>
  implements IView<IInteractionIndicatorViewStyles> {
  private _$rootElement: HTMLElement;

  private _playIcon: string;
  private _pauseIcon: string;
  private _forwardIcon: string;
  private _rewindIcon: string;
  private _increaseVolumeIcon: string;
  private _decreaseVolumeIcon: string;
  private _muteIcon: string;

  constructor() {
    super();

    this._$rootElement = htmlToElement(
      containerTemplate({
        styles: this.styleNames,
      }),
    );

    this._playIcon = playIconTemplate({
      styles: this.styleNames,
    });
    this._pauseIcon = pauseIconTemplate({
      styles: this.styleNames,
    });
    this._forwardIcon = forwardIconTemplate({
      texts: {
        SECONDS_COUNT,
      },
      styles: this.styleNames,
    });
    this._rewindIcon = rewindIconTemplate({
      texts: {
        SECONDS_COUNT,
      },
      styles: this.styleNames,
    });
    this._increaseVolumeIcon = increaseVolumeIconTemplate({
      styles: this.styleNames,
    });
    this._decreaseVolumeIcon = decreaseVolumeIconTemplate({
      styles: this.styleNames,
    });
    this._muteIcon = muteIconTemplate({
      styles: this.styleNames,
    });
  }

  activatePlayIcon() {
    this._$rootElement.innerHTML = this._playIcon;
  }

  activatePauseIcon() {
    this._$rootElement.innerHTML = this._pauseIcon;
  }

  activateForwardIcon() {
    this._$rootElement.innerHTML = this._forwardIcon;
  }

  activateRewindIcon() {
    this._$rootElement.innerHTML = this._rewindIcon;
  }

  activateIncreaseVolumeIcon() {
    this._$rootElement.innerHTML = this._increaseVolumeIcon;
  }

  activateDecreaseVolumeIcon() {
    this._$rootElement.innerHTML = this._decreaseVolumeIcon;
  }

  activateMuteVolumeIcon() {
    this._$rootElement.innerHTML = this._muteIcon;
  }

  deactivateIcon() {
    this._$rootElement.innerHTML = '';
  }

  hide() {
    this._$rootElement.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$rootElement.classList.remove(this.styleNames.hidden);
  }

  getElement() {
    return this._$rootElement;
  }

  destroy() {
    if (this._$rootElement.parentNode) {
      this._$rootElement.parentNode.removeChild(this._$rootElement);
    }

    this._$rootElement = null;
  }
}

InteractionIndicatorView.extendStyleNames(styles);

export default InteractionIndicatorView;
