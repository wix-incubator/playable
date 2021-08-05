import template1 from './container.dot';
import template2 from './playIcon.dot';
import template3 from './pauseIcon.dot';
import template4 from './forwardIcon.dot';
import template5 from './rewindIcon.dot';
import template6 from './increaseVolumeIcon.dot';
import template7 from './decreaseVolumeIcon.dot';
import template8 from './muteIcon.dot';

const containerTemplate = template1.default ? template1.default : template1;
const playIconTemplate = template2.default ? template2.default : template2;
const pauseIconTemplate = template3.default ? template3.default : template3;
const forwardIconTemplate = template4.default ? template4.default : template4;
const rewindIconTemplate = template5.default ? template5.default : template5;
const increaseVolumeIconTemplate = template6.default
  ? template6.default
  : template6;
const decreaseVolumeIconTemplate = template7.default
  ? template7.default
  : template7;
const muteIconTemplate = template8.default ? template8.default : template8;

export {
  containerTemplate,
  pauseIconTemplate,
  playIconTemplate,
  forwardIconTemplate,
  rewindIconTemplate,
  increaseVolumeIconTemplate,
  decreaseVolumeIconTemplate,
  muteIconTemplate,
};
