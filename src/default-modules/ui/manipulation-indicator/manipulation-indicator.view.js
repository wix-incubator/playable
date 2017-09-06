import $ from 'jbone';

import View from '../core/view';

import styles from './manipulation-indicator.scss';


const SECONDS_COUNT = 5;

class ManipulationIndicatorView extends View {
  constructor() {
    super();

    this.$node = $('<div>', {
      class: `${this.styleNames['icon-container']}`
    });

    this.playIcon = `<div class="${this.styleNames.icon}"><svg class="${this.styleNames['play-icon']} ${this.styleNames['animated-icon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 14"><path fill="#FFF" fill-rule="evenodd" d="M.079 0L0 14l10.5-7.181z"/></svg></div>`;
    this.pauseIcon = `<div class="${this.styleNames.icon}"><svg class="${this.styleNames['pause-icon']} ${this.styleNames['animated-icon']}"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path fill="#FFF" fill-rule="evenodd" d="M7 0h3v14H7V0zM0 0h3v14H0V0z"/></svg></div>`;
    this.forwardIcon = `<div class="${this.styleNames.icon}"><div class="${this.styleNames.seconds}"><span>${SECONDS_COUNT}</span></div><svg class="${this.styleNames['forward-icon']} ${this.styleNames['animated-icon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"><path fill="#FFF" fill-rule="evenodd" d="M17 0c4.59 0 8.84 1.87 11.9 4.93V1.7h3.4v10.2H22.1V8.5h5.44C24.99 5.27 21.25 3.4 17 3.4 9.52 3.4 3.4 9.52 3.4 17c0 7.48 6.12 13.6 13.6 13.6 7.48 0 13.6-6.12 13.6-13.6H34c0 9.35-7.65 17-17 17S0 26.35 0 17 7.65 0 17 0z"/></svg></div>`;
    this.rewindIcon = `<div class="${this.styleNames.icon}"><div class="${this.styleNames.seconds}"><span>${SECONDS_COUNT}</span></div><svg class="${this.styleNames['rewind-icon']} ${this.styleNames['animated-icon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"><path fill="#FFF" fill-rule="evenodd" d="M17 0C12.41 0 8.16 1.87 5.1 4.93V1.7H1.7v10.2h10.2V8.5H6.46C9.01 5.27 12.75 3.4 17 3.4c7.48 0 13.6 6.12 13.6 13.6 0 7.48-6.12 13.6-13.6 13.6-7.48 0-13.6-6.12-13.6-13.6H0c0 9.35 7.65 17 17 17s17-7.65 17-17S26.35 0 17 0z"/></svg></div>`;
    this.descreaseVolumeIcon = `<div class="${this.styleNames.icon}"><svg class="${this.styleNames['decrease-volume-icon']} ${this.styleNames['animated-icon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/><path stroke="#FFF" d="M9.853 10.837a5.45 5.45 0 0 0 0-7.707"/></g></svg></div>`;
    this.increaseVolumeIcon = `<div class="${this.styleNames.icon}"><svg class="${this.styleNames['increase-volume-icon']} ${this.styleNames['animated-icon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/><path stroke="#FFF" d="M12.793 13.716a9.607 9.607 0 0 0 0-13.586M9.853 10.837a5.45 5.45 0 0 0 0-7.707"/></g></svg></div>`;
    this.muteIcon = `<div class="${this.styleNames.icon}"><svg class="${this.styleNames['decrease-volume-icon']} ${this.styleNames['animated-icon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14"><g fill="#FFF" fill-rule="evenodd"><path fill="#FFF" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/><path stroke="#FFF" d="M13 6.257l-2.05-2.05-.743.743L12.257 7l-2.05 2.05.743.743L13 7.743l2.05 2.05.743-.743L13.743 7l2.05-2.05-.743-.743L13 6.257z"/></g></svg></div>`;
  }

  activatePlayIcon() {
    this.$node.html(this.playIcon);
  }

  activatePauseIcon() {
    this.$node.html(this.pauseIcon);
  }

  activateForwardIcon() {
    this.$node.html(this.forwardIcon);
  }

  activateRewindIcon() {
    this.$node.html(this.rewindIcon);
  }

  activateIncreaseVolumeIcon() {
    this.$node.html(this.increaseVolumeIcon);
  }

  activateDecreaseVolumeIcon() {
    this.$node.html(this.descreaseVolumeIcon);
  }

  activateMuteVolumeIcon() {
    this.$node.html(this.muteIcon);
  }

  deactivateIcon() {
    this.$node.html('');
  }

  getNode() {
    return this.$node[0];
  }

  destroy() {
    this.$node.remove();

    delete this.$node;
  }
}

ManipulationIndicatorView.extendStyleNames(styles);

export default ManipulationIndicatorView;
