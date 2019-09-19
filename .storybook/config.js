import { addDecorator, addParameters, configure } from '@storybook/react';
import {withA11y} from '@storybook/addon-a11y';
import {withKnobs} from '@storybook/addon-knobs';
import { create } from '@storybook/theming';

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'Get Domain',
      brandUrl: 'https://github.com/wix/playable',
      brandImage: null,
    }),
  },
});

addDecorator(withA11y);
addDecorator(withKnobs);

configure(require.context('../src', true, /\.stories\.tsx$/), module);
