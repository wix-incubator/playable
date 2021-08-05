import template1 from './subtitles.dot';
import template2 from './subtitle.dot';
const subtitlesTemplate = template1.default ? template1.default : template1;
const singleSubtitleTemplate = template2.default
  ? template2.default
  : template2;
export { subtitlesTemplate, singleSubtitleTemplate };
