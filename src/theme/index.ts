import jss from 'jss';
import preset from 'jss-preset-default';
import * as merge from 'lodash/merge';

jss.setup(preset());

export const defaultThemeConfig = {
  svgFill: '#FFF',
  svgFillRule: 'evenodd',
};

export interface ThemeConfig {
  svgFill?: string,
  svgFillRule?: string
}

export function createStyleSheet(config: ThemeConfig = {}) {
  const styleSheet = (jss as any).createStyleSheet({
    svgStyle: {
      fill: data => data.svgFill,
      fillRule: data => data.svgFillRule,
    },
  }, { link: true });

  styleSheet.update(merge(defaultThemeConfig, config));

  return styleSheet
}
