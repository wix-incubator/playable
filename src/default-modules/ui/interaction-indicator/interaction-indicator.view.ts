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

import * as styles from './interaction-indicator.scss';

const SECONDS_COUNT = 5;

class InteractionIndicatorView extends View<IInteractionIndicatorViewStyles>
  implements IView<IInteractionIndicatorViewStyles> {
  private _$node: HTMLElement;

  private _playIcon: string;
  private _pauseIcon: string;
  private _forwardIcon: string;
  private _rewindIcon: string;
  private _increaseVolumeIcon: string;
  private _decreaseVolumeIcon: string;
  private _muteIcon: string;

  constructor() {
    super();

    this._$node = htmlToElement(
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
    this._$node.innerHTML = this._playIcon;
  }

  activatePauseIcon() {
    this._$node.innerHTML = this._pauseIcon;
  }

  activateForwardIcon() {
    this._$node.innerHTML = this._forwardIcon;
  }

  activateRewindIcon() {
    this._$node.innerHTML = this._rewindIcon;
  }

  activateIncreaseVolumeIcon() {
    this._$node.innerHTML = this._increaseVolumeIcon;
  }

  activateDecreaseVolumeIcon() {
    this._$node.innerHTML = this._decreaseVolumeIcon;
  }

  activateMuteVolumeIcon() {
    this._$node.innerHTML = this._muteIcon;
  }

  deactivateIcon() {
    this._$node.innerHTML = '';
  }

  hide() {
    this._$node.classList.add(this.styleNames.hidden);
  }

  show() {
    this._$node.classList.remove(this.styleNames.hidden);
  }

  getNode() {
    return this._$node;
  }

  destroy() {
    if (this._$node.parentNode) {
      this._$node.parentNode.removeChild(this._$node);
    }

    delete this._$node;
  }
}

InteractionIndicatorView.extendStyleNames(styles);

export default InteractionIndicatorView;
