import $ from 'jbone';

import VIDEO_EVENTS from '../constants/events/video';

import eventEmitter from '../event-emitter';

import createControls from './controls';

import styles from './ui.css';


function PlayerUI({ $video }) {
  this.$video = $video;
  this.initWrapper();
  this.initEvents();
}

PlayerUI.prototype = {
  initWrapper: function() {
    this.$wrapper = $('<div>', {
      class: styles['video-wrapper']
    });

    this.$controls = createControls();
    this.$wrapper
      .append(this.$video)
      .append(this.$controls);
  },
  initEvents: function() {
    eventEmitter
      .on(VIDEO_EVENTS.PLAY, () => {
        this.$wrapper.toggleClass(styles['video-playing'], true);
      });
    eventEmitter
      .on(VIDEO_EVENTS.PAUSE, () => {
        this.$wrapper.toggleClass(styles['video-playing'], false);
      });
  }
};

export default PlayerUI;
