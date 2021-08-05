import template1 from './logo.dot';
import template2 from './logo-image.dot';
import template3 from './logo-input.dot';
import template4 from './logo-button.dot';

const logoTemplate = template1.default ? template1.default : template1;
const logoImageTemplate = template2.default ? template2.default : template2;
const logoInputTemplate = template3.default ? template3.default : template3;
const logoButtonTemplate = template4.default ? template4.default : template4;

export {
  logoTemplate,
  logoImageTemplate,
  logoButtonTemplate,
  logoInputTemplate,
};
