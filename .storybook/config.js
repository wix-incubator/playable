import { addDecorator, addParameters, configure } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { create } from '@storybook/theming';

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'Playable',
      brandUrl: 'https://github.com/wix/playable',
      brandImage: null,
    }),
    panelPosition: 'right',
    showNav: false,
  },
});

addDecorator(withA11y);
addDecorator(withKnobs);

require('./styles.scss');

configure(require.context('../src', true, /\.stories\.tsx$/), module);
