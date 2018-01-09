import * as merge from 'lodash/merge';
import { StyleSheet } from './style-sheet';

export const defaultThemeConfig = {
  svgFill: '#F00',
  svgFillRule: 'evenodd',
};

export interface ThemeConfig {
  svgFill?: string;
  svgFillRule?: string;
}

export function createStyleSheet(config: ThemeConfig = {}) {
  const styleSheet = new StyleSheet({
    svgStyle: {
      fill: data => data.svgFill,
      'fill-rule': data => data.svgFillRule,
    },
  });

  styleSheet.update(merge(defaultThemeConfig, config));

  return styleSheet;
}
