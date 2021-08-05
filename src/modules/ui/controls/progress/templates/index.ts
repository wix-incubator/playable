import template1 from './progress.dot';
import template2 from './progressTimeIndicator.dot';

const progressTemplate = template1.default ? template1.default : template1;
const progressTimeIndicatorTemplate = template2.default
  ? template2.default
  : template2;

export { progressTemplate, progressTimeIndicatorTemplate };
