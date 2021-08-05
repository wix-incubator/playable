import template1 from './tooltip.dot';
import template2 from './tooltipContainer.dot';

const tooltipTemplate = template1.default ? template1.default : template1;
const tooltipContainerTemplate = template2.default
  ? template2.default
  : template2;

export { tooltipTemplate, tooltipContainerTemplate };
